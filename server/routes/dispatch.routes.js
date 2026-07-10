const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET all active dispatch rules
router.get('/rules', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const rules = await prisma.dispatch_rules.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: 'asc' }
        });
        res.json(rules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new dispatch rule
router.post('/rules', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { name, condition_field, condition_operator, condition_value, action_type, action_value } = req.body;
        
        const rule = await prisma.dispatch_rules.create({
            data: {
                company_id: companyId,
                name,
                condition_field,
                condition_operator,
                condition_value,
                action_type,
                action_value
            }
        });
        res.status(201).json(rule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE dispatch rule
router.delete('/rules/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        
        const existing = await prisma.dispatch_rules.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Rule not found' });

        await prisma.dispatch_rules.delete({ where: { id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT toggle rule active status
router.put('/rules/:id/toggle', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { is_active } = req.body;
        
        const existing = await prisma.dispatch_rules.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Rule not found' });

        const rule = await prisma.dispatch_rules.update({
            where: { id },
            data: { is_active }
        });
        res.json(rule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
