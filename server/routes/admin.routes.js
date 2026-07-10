const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Admin Auth
router.post('/auth', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSCODE) {
        // Returning a simple static token for this project
        res.json({ success: true, token: 'slrros_admin_token_xyz' });
    } else {
        res.status(401).json({ success: false, error: 'Incorrect code' });
    }
});

// Get all orders with tracking info
router.get('/orders', async (req, res) => {
    try {
        const query = `
            SELECT o.*, 
                   s.name as source_name, 
                   d.name as dest_name
            FROM orders o
            LEFT JOIN warehouses s ON o.source_warehouse_id = s.id
            LEFT JOIN warehouses d ON o.dest_warehouse_id = d.id
            ORDER BY o.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error("DB Error in /orders:", err);
        res.status(500).json({ error: err.message });
    }
});

// Advance delivery simulation
router.post('/orders/:id/advance', async (req, res) => {
    const orderId = req.params.id;
    try {
        const [rows] = await db.query('SELECT progress_pct FROM orders WHERE id = ?', [orderId]);
        if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        let pct = rows[0].progress_pct + 15; // advance by 15% each click
        if (pct >= 100) pct = 100;

        let status = 'placed';
        if (pct > 0 && pct < 20) status = 'verified';
        else if (pct >= 20 && pct < 40) status = 'packed';
        else if (pct >= 40 && pct < 99) status = 'in_transit';
        else if (pct >= 100) status = 'delivered';

        await db.query('UPDATE orders SET progress_pct = ?, status = ? WHERE id = ?', [pct, status, orderId]);
        res.json({ success: true, progress_pct: pct, status });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
