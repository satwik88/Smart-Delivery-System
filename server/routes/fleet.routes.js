const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET all vehicles with assignments and maintenance
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const vehicles = await prisma.vehicles.findMany({
            where: { company_id: companyId },
            include: {
                driver_assignments: {
                    where: { status: 'ACTIVE' },
                    include: { user: { select: { id: true, username: true, role: true } } }
                }
            },
            orderBy: { id: 'desc' }
        });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET vehicle by ID
router.get('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const vehicle = await prisma.vehicles.findFirst({
            where: { id, company_id: companyId },
            include: {
                maintenance_logs: { orderBy: { date: 'desc' } },
                driver_assignments: { orderBy: { start_time: 'desc' }, include: { user: { select: { id: true, username: true, role: true } } } }
            }
        });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new vehicle
router.post('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { name, capacity_weight, type, license_plate, fuel_efficiency } = req.body;
        const vehicle = await prisma.vehicles.create({
            data: {
                company_id: companyId,
                name,
                capacity_weight: parseFloat(capacity_weight) || 0,
                type: type || 'TRUCK',
                status: 'ACTIVE',
                license_plate: license_plate || null,
                fuel_efficiency: fuel_efficiency ? parseFloat(fuel_efficiency) : null
            }
        });
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update vehicle
router.put('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { name, capacity_weight, type, status, license_plate, fuel_efficiency, total_distance } = req.body;
        
        const existing = await prisma.vehicles.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Vehicle not found' });

        const vehicle = await prisma.vehicles.update({
            where: { id },
            data: {
                name: name || existing.name,
                capacity_weight: capacity_weight !== undefined ? parseFloat(capacity_weight) : existing.capacity_weight,
                type: type || existing.type,
                status: status || existing.status,
                license_plate: license_plate !== undefined ? license_plate : existing.license_plate,
                fuel_efficiency: fuel_efficiency !== undefined ? parseFloat(fuel_efficiency) : existing.fuel_efficiency,
                total_distance: total_distance !== undefined ? parseFloat(total_distance) : existing.total_distance
            }
        });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Maintenance Log
router.post('/:id/maintenance', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { description, cost } = req.body;

        const log = await prisma.maintenance_logs.create({
            data: {
                company_id: companyId,
                vehicle_id: id,
                description,
                cost: parseFloat(cost) || 0,
                status: 'COMPLETED'
            }
        });

        // Automatically update vehicle status or last_service_date
        await prisma.vehicles.update({
            where: { id },
            data: { last_service_date: new Date(), status: 'ACTIVE' }
        });

        // Log expense in financial_transactions
        if (parseFloat(cost) > 0) {
            await prisma.financial_transactions.create({
                data: {
                    company_id: companyId,
                    type: 'EXPENSE',
                    category: 'MAINTENANCE',
                    amount: parseFloat(cost),
                    description: `Maintenance for Vehicle #${id}: ${description}`,
                    reference_id: log.id.toString()
                }
            });
        }

        res.status(201).json(log);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Driver Assignment
router.post('/:id/assignments', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { user_id } = req.body;

        // End any currently active assignment for this vehicle
        await prisma.driver_assignments.updateMany({
            where: { vehicle_id: id, status: 'ACTIVE', company_id: companyId },
            data: { status: 'COMPLETED', end_time: new Date() }
        });

        // End any active assignment for this user on other vehicles
        await prisma.driver_assignments.updateMany({
            where: { user_id: parseInt(user_id), status: 'ACTIVE', company_id: companyId },
            data: { status: 'COMPLETED', end_time: new Date() }
        });

        const assignment = await prisma.driver_assignments.create({
            data: {
                company_id: companyId,
                vehicle_id: id,
                user_id: parseInt(user_id),
                status: 'ACTIVE'
            }
        });

        res.status(201).json(assignment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT Telemetry
router.put('/:id/telemetry', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { lat, lng } = req.body;
        
        await prisma.vehicles.updateMany({
            where: { id, company_id: companyId },
            data: {
                current_location_lat: parseFloat(lat),
                current_location_lng: parseFloat(lng)
            }
        });

        // Broadcast updated coordinates
        const io = req.app.get('io');
        const { broadcastDriverLocations } = require('../services/liveTracking');
        broadcastDriverLocations(io, companyId);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
