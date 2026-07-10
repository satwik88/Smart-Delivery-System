const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET all notifications for the company
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const notifications = await prisma.notifications.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: 'desc' },
            take: 50 // Limit to recent 50
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT mark notification as read
router.put('/:id/read', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        
        const existing = await prisma.notifications.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Notification not found' });

        const notification = await prisma.notifications.update({
            where: { id },
            data: { is_read: true }
        });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
