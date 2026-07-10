const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { broadcastNotification } = require('../services/notifications');

// API Key Auth Middleware
const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (!apiKey) return res.status(401).json({ error: 'API key is required' });

    try {
        const keyRecord = await prisma.api_keys.findUnique({
            where: { key: apiKey },
            include: { company: true }
        });

        if (!keyRecord || keyRecord.company.status === 'SUSPENDED') {
            return res.status(403).json({ error: 'Invalid API key or suspended account' });
        }

        await prisma.api_keys.update({
            where: { id: keyRecord.id },
            data: { last_used: new Date() }
        });

        req.companyId = keyRecord.company_id;
        next();
    } catch (err) {
        res.status(500).json({ error: 'Authentication error' });
    }
};

// Ingest GPS coordinates (Mobile App)
router.post('/gps', apiKeyAuth, async (req, res) => {
    try {
        const { vehicle_id, lat, lng } = req.body;
        const companyId = req.companyId;

        if (!vehicle_id || !lat || !lng) {
            return res.status(400).json({ error: 'Missing required telemetry fields.' });
        }

        const vehicle = await prisma.vehicles.findFirst({ where: { id: vehicle_id, company_id: companyId } });
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found.' });

        await prisma.vehicles.update({
            where: { id: vehicle_id },
            data: {
                current_location_lat: parseFloat(lat),
                current_location_lng: parseFloat(lng)
            }
        });

        // Inform connected dispatchers via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.to(`company_${companyId}`).emit('vehicle_location_update', {
                vehicle_id, lat, lng
            });
        }

        res.json({ success: true, updated: { vehicle_id, lat, lng } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ingest Sensor Data (IoT)
router.post('/sensor', apiKeyAuth, async (req, res) => {
    try {
        const { vehicle_id, temperature, humidity } = req.body;
        const companyId = req.companyId;

        // E.g., if temperature > 15 (Celsius) for a refrigerated truck
        if (temperature > 15) {
            const io = req.app.get('io');
            await broadcastNotification(io, companyId, 'Temperature Alert', `Vehicle ${vehicle_id} exceeded safe temperature limits (${temperature}°C).`, 'WARNING');
        }

        res.json({ success: true, status: 'Logged' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
