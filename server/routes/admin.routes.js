const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Admin Auth (Deprecated in multi-tenant mode, keeping for legacy compatibility or removal)
// You would ideally use /api/auth/login for actual users now. 
// We will just return 410 Gone since we've replaced auth entirely.
router.post('/auth', (req, res) => {
    res.status(410).json({ error: 'Auth has moved to /api/auth/login' });
});

// Get all orders with tracking info
router.get('/orders', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const orders = await prisma.orders.findMany({
            where: { company_id: companyId },
            include: {
                source_warehouse: true,
                dest_warehouse: true
            },
            orderBy: { id: 'desc' }
        });
        
        // Map to legacy format
        const rows = orders.map(o => ({
            ...o,
            source_name: o.source_warehouse ? o.source_warehouse.name : null,
            dest_name: o.dest_warehouse ? o.dest_warehouse.name : null,
        }));
        
        res.json(rows);
    } catch (err) {
        console.error("DB Error in /orders:", err);
        res.status(500).json({ error: err.message });
    }
});

// Advance delivery simulation
router.post('/orders/:id/advance', async (req, res) => {
    const orderId = parseInt(req.params.id);
    try {
        const companyId = req.user.company_id;
        const order = await prisma.orders.findFirst({
            where: { id: orderId, company_id: companyId }
        });
        
        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        let pct = (order.progress_pct || 0) + 15; // advance by 15% each click
        if (pct >= 100) pct = 100;

        let status = 'placed';
        if (pct > 0 && pct < 20) status = 'verified';
        else if (pct >= 20 && pct < 40) status = 'packed';
        else if (pct >= 40 && pct < 99) status = 'in_transit';
        else if (pct >= 100) status = 'delivered';

        await prisma.orders.update({
            where: { id: orderId },
            data: { progress_pct: pct, status: status }
        });
        
        res.json({ success: true, progress_pct: pct, status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
