const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { subsetSum } = require('../algorithms/subsetSum');
const { broadcastNotification } = require('../services/notifications');

// Run Subset Sum
router.post('/combinations', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { budget } = req.body;
        if (!budget) return res.status(400).json({ error: 'budget is required' });

        const items = await prisma.order_items.findMany({
            where: { company_id: companyId }
        });
        const prices = items.map(item => item.price);
        
        const result = subsetSum(prices, parseFloat(budget));

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'subsetSum',
                dataset_size: prices.length,
                comparisons: result.metrics.comparisons,
                swaps: result.metrics.swaps,
                time_ms: result.metrics.time
            }
        });

        // Optional: Map back prices to products
        const subsetsWithProducts = result.result.subsets.map(subsetPrices => {
            return subsetPrices.map(p => items.find(i => i.price === p));
        });
        
        result.result.subsetsWithProducts = subsetsWithProducts;

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all orders
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const orders = await prisma.orders.findMany({
            where: { company_id: companyId },
            include: { vehicle: true, source_warehouse: true, dest_warehouse: true },
            orderBy: { id: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const order = await prisma.orders.findFirst({
            where: { id, company_id: companyId },
            include: { vehicle: true, source_warehouse: true, dest_warehouse: true }
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new order
router.post('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { 
            customer_name, budget, source_warehouse_id, dest_warehouse_id, vehicle_id,
            scheduled_for, is_recurring, recurrence_pattern, priority, order_type,
            delivery_notes, dispatcher_notes, customer_instructions
        } = req.body;
        
        const activeRules = await prisma.dispatch_rules.findMany({
            where: { company_id: companyId, is_active: true }
        });

        let assignedVehicleId = vehicle_id ? parseInt(vehicle_id) : null;
        let initialStatus = 'placed';

        for (const rule of activeRules) {
            let match = false;
            let fieldValue = req.body[rule.condition_field];
            if (fieldValue !== undefined) {
                if (rule.condition_operator === 'EQUALS' && String(fieldValue).toUpperCase() === rule.condition_value.toUpperCase()) match = true;
                if (rule.condition_operator === 'GREATER_THAN' && parseFloat(fieldValue) > parseFloat(rule.condition_value)) match = true;
                if (rule.condition_operator === 'LESS_THAN' && parseFloat(fieldValue) < parseFloat(rule.condition_value)) match = true;
            }
            if (match) {
                if (rule.action_type === 'ASSIGN_VEHICLE') {
                    assignedVehicleId = parseInt(rule.action_value);
                    initialStatus = 'verified';
                }
            }
        }

        const order = await prisma.orders.create({
            data: {
                company_id: companyId,
                customer_name: customer_name || 'Walk-in Customer',
                budget: parseFloat(budget) || 0,
                source_warehouse_id: source_warehouse_id ? parseInt(source_warehouse_id) : null,
                dest_warehouse_id: dest_warehouse_id ? parseInt(dest_warehouse_id) : null,
                vehicle_id: assignedVehicleId,
                tracking_code: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                status: initialStatus,
                scheduled_for: scheduled_for ? new Date(scheduled_for) : null,
                is_recurring: !!is_recurring,
                recurrence_pattern: recurrence_pattern || null,
                priority: priority || 'STANDARD',
                order_type: order_type || 'DELIVERY',
                delivery_notes: delivery_notes || null,
                dispatcher_notes: dispatcher_notes || null,
                customer_instructions: customer_instructions || null,
                otp_code: Math.floor(100000 + Math.random() * 900000).toString(), // Generate a 6-digit OTP
            }
        });

        await prisma.order_events.create({
            data: {
                company_id: companyId,
                order_id: order.id,
                status: initialStatus,
                description: initialStatus === 'verified' ? 'Order was auto-assigned by Dispatch Rules Engine.' : 'Order was placed manually by dispatcher.'
            }
        });

        if (order.budget > 0) {
            await prisma.financial_transactions.create({
                data: {
                    company_id: companyId,
                    type: 'REVENUE',
                    category: 'ORDER',
                    amount: order.budget,
                    description: `Revenue from Order ${order.tracking_code}`,
                    reference_id: order.tracking_code
                }
            });
        }

        // Broadcast a global notification
        const io = req.app.get('io');
        await broadcastNotification(io, companyId, 'New Order Placed', `Order ${order.tracking_code} was successfully placed.`, 'SUCCESS');
        
        if (initialStatus === 'verified') {
            await broadcastNotification(io, companyId, 'Dispatch Rule Triggered', `Rules Engine auto-assigned Vehicle ${assignedVehicleId} to Order ${order.tracking_code}.`, 'INFO');
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update order
router.put('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { status, vehicle_id, progress_pct } = req.body;
        
        // Ensure it belongs to company
        const existing = await prisma.orders.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Order not found' });

        const order = await prisma.orders.update({
            where: { id },
            data: {
                status: status || existing.status,
                vehicle_id: vehicle_id ? parseInt(vehicle_id) : existing.vehicle_id,
                progress_pct: progress_pct !== undefined ? parseFloat(progress_pct) : existing.progress_pct
            }
        });

        if (status && status !== existing.status) {
            await prisma.order_events.create({
                data: {
                    company_id: companyId,
                    order_id: id,
                    status: status,
                    description: `Order status updated from ${existing.status} to ${status}.`
                }
            });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        
        const existing = await prisma.orders.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Order not found' });

        await prisma.orders.delete({ where: { id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET order timeline
router.get('/:id/timeline', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        
        const events = await prisma.order_events.findMany({
            where: { order_id: id, company_id: companyId },
            orderBy: { created_at: 'asc' }
        });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST OTP Verification
router.post('/:id/verify', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { otp } = req.body;

        const order = await prisma.orders.findFirst({ where: { id, company_id: companyId } });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (order.otp_code !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        await prisma.orders.update({
            where: { id },
            data: { status: 'delivered', progress_pct: 100 }
        });

        await prisma.order_events.create({
            data: {
                company_id: companyId,
                order_id: id,
                status: 'delivered',
                description: 'Order successfully delivered. OTP verified.'
            }
        });

        res.json({ success: true, message: 'OTP verified successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Bulk Orders
router.post('/bulk', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { orders } = req.body; // Expecting an array of order objects

        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({ error: 'orders array is required' });
        }

        const createdOrders = [];
        for (const o of orders) {
            const tracking = `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const created = await prisma.orders.create({
                data: {
                    company_id: companyId,
                    customer_name: o.customer_name || 'Walk-in Customer',
                    budget: parseFloat(o.budget) || 0,
                    priority: o.priority || 'STANDARD',
                    order_type: o.order_type || 'DELIVERY',
                    status: 'placed',
                    tracking_code: tracking,
                    otp_code: otp
                }
            });

            await prisma.order_events.create({
                data: {
                    company_id: companyId,
                    order_id: created.id,
                    status: 'placed',
                    description: 'Order imported via bulk CSV upload.'
                }
            });
            createdOrders.push(created);
        }

        res.status(201).json({ success: true, count: createdOrders.length, orders: createdOrders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
