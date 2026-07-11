const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

// GET all drivers and their assigned vehicles
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const drivers = await prisma.users.findMany({
            where: { company_id: companyId, role: 'driver' },
            select: { 
                id: true, 
                username: true, 
                role: true,
                driver_assignments: {
                    where: { status: 'ACTIVE' },
                    include: { vehicle: true }
                }
            }
        });
        
        const vehicles = await prisma.vehicles.findMany({
            where: { company_id: companyId }
        });

        res.json({ drivers, vehicles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new driver
router.post('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password required' });

        const existingUser = await prisma.users.findUnique({ where: { username } });
        if (existingUser) return res.status(409).json({ error: 'Username already exists' });

        const password_hash = await bcrypt.hash(password, 10);
        
        const driver = await prisma.users.create({
            data: {
                company_id: companyId,
                username,
                password_hash,
                role: 'driver'
            },
            select: { id: true, username: true, role: true }
        });
        
        res.status(201).json(driver);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mobile - GET active vehicle assignment
router.get('/mobile/active-vehicle', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;

        const assignment = await prisma.driver_assignments.findFirst({
            where: { user_id: userId, status: 'ACTIVE', company_id: companyId },
            include: { vehicle: true }
        });

        res.json(assignment || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mobile - GET assigned active orders
router.get('/mobile/orders', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;

        const assignment = await prisma.driver_assignments.findFirst({
            where: { user_id: userId, status: 'ACTIVE', company_id: companyId }
        });

        if (!assignment) {
            return res.json([]);
        }

        const orders = await prisma.orders.findMany({
            where: {
                company_id: companyId,
                vehicle_id: assignment.vehicle_id,
                status: { not: 'delivered' }
            },
            include: { source_warehouse: true, dest_warehouse: true },
            orderBy: { id: 'desc' }
        });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mobile - PUT update order status
router.put('/mobile/orders/:id/status', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;
        const orderId = parseInt(req.params.id);
        const { status } = req.body;

        const assignment = await prisma.driver_assignments.findFirst({
            where: { user_id: userId, status: 'ACTIVE', company_id: companyId }
        });

        if (!assignment) {
            return res.status(403).json({ error: 'No active vehicle assignment' });
        }

        const order = await prisma.orders.findFirst({
            where: { id: orderId, company_id: companyId, vehicle_id: assignment.vehicle_id }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found or not assigned to your vehicle' });
        }

        const updated = await prisma.orders.update({
            where: { id: orderId },
            data: {
                status: status,
                progress_pct: status === 'in_transit' ? 50 : undefined
            }
        });

        await prisma.order_events.create({
            data: {
                company_id: companyId,
                order_id: orderId,
                status: status,
                description: `Status updated to ${status} by driver ${req.user.username}.`
            }
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mobile - PUT reject assigned order
router.put('/mobile/orders/:id/reject', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;
        const orderId = parseInt(req.params.id);

        const assignment = await prisma.driver_assignments.findFirst({
            where: { user_id: userId, status: 'ACTIVE', company_id: companyId }
        });

        if (!assignment) {
            return res.status(403).json({ error: 'No active vehicle assignment' });
        }

        const order = await prisma.orders.findFirst({
            where: { id: orderId, company_id: companyId, vehicle_id: assignment.vehicle_id }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found or not assigned to your vehicle' });
        }

        const updated = await prisma.orders.update({
            where: { id: orderId },
            data: {
                vehicle_id: null,
                status: 'placed',
                progress_pct: 0
            }
        });

        await prisma.order_events.create({
            data: {
                company_id: companyId,
                order_id: orderId,
                status: 'placed',
                description: `Order rejected by driver ${req.user.username}. Re-routing to dispatcher.`
            }
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mobile - POST verify OTP and complete order
router.post('/mobile/orders/:id/verify-otp', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;
        const orderId = parseInt(req.params.id);
        const { otp } = req.body;

        const assignment = await prisma.driver_assignments.findFirst({
            where: { user_id: userId, status: 'ACTIVE', company_id: companyId }
        });

        if (!assignment) {
            return res.status(403).json({ error: 'No active vehicle assignment' });
        }

        const order = await prisma.orders.findFirst({
            where: { id: orderId, company_id: companyId, vehicle_id: assignment.vehicle_id }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found or not assigned to your vehicle' });
        }

        if (order.otp_code !== otp) {
            return res.status(400).json({ error: 'Invalid OTP code' });
        }

        const updated = await prisma.orders.update({
            where: { id: orderId },
            data: {
                status: 'delivered',
                progress_pct: 100
            }
        });

        await prisma.order_events.create({
            data: {
                company_id: companyId,
                order_id: orderId,
                status: 'delivered',
                description: 'OTP verified by driver. Order successfully delivered.'
            }
        });

        res.json({ success: true, order: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
