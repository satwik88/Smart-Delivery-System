const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const crypto = require('crypto');

// GET all API keys for the company
router.get('/keys', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const keys = await prisma.api_keys.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: 'desc' }
        });
        // Mask the key — only show last 4 chars
        const masked = keys.map(k => ({
            id: k.id,
            name: k.name,
            key_preview: `sk_live_...${k.key.slice(-6)}`,
            last_used: k.last_used,
            created_at: k.created_at
        }));
        res.json(masked);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST generate new API key
router.post('/keys', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'name is required' });

        const rawKey = `sk_live_${crypto.randomBytes(20).toString('hex')}`;
        const apiKey = await prisma.api_keys.create({
            data: { company_id: companyId, name, key: rawKey }
        });
        // Return the full key once — never again after this
        res.status(201).json({
            id: apiKey.id,
            name: apiKey.name,
            key: rawKey,  // full key returned only on creation
            key_preview: `sk_live_...${rawKey.slice(-6)}`,
            created_at: apiKey.created_at
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE an API key
router.delete('/keys/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const existing = await prisma.api_keys.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Key not found' });
        await prisma.api_keys.delete({ where: { id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
