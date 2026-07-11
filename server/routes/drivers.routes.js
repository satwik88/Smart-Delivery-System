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

module.exports = router;
