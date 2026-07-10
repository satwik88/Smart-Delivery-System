const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// API Key Auth Middleware for public endpoints
const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    try {
        const keyRecord = await prisma.api_keys.findUnique({
            where: { key: apiKey },
            include: { company: true }
        });

        if (!keyRecord) {
            return res.status(403).json({ error: 'Invalid API key' });
        }

        if (keyRecord.company.status === 'SUSPENDED') {
            return res.status(403).json({ error: 'Account suspended' });
        }

        // Update last used
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

// GET /api/public/tracking/:code
router.get('/tracking/:code', async (req, res) => {
    try {
        // This endpoint doesn't require an API key since it's meant for customers checking tracking
        const trackingCode = req.params.code;
        const order = await prisma.orders.findUnique({
            where: { tracking_code: trackingCode },
            include: { events: { orderBy: { created_at: 'desc' } } }
        });
        
        if (!order) return res.status(404).json({ error: 'Tracking code not found' });
        
        res.json({
            tracking_code: order.tracking_code,
            status: order.status,
            customer_name: order.customer_name,
            events: order.events
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/public/orders (Requires API Key)
router.post('/orders', apiKeyAuth, async (req, res) => {
    try {
        const companyId = req.companyId;
        const { customer_name, budget, priority, order_type } = req.body;
        
        const tracking_code = `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const otp_code = Math.floor(100000 + Math.random() * 900000).toString();

        const order = await prisma.orders.create({
            data: {
                company_id: companyId,
                customer_name: customer_name || 'API Import',
                budget: parseFloat(budget) || 0,
                priority: priority || 'STANDARD',
                order_type: order_type || 'DELIVERY',
                status: 'placed',
                tracking_code,
                otp_code
            }
        });

        await prisma.order_events.create({
            data: {
                company_id: companyId,
                order_id: order.id,
                status: 'placed',
                description: 'Order created via Public API.'
            }
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
