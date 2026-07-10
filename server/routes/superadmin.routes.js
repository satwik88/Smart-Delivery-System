const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Middleware to ensure user is super_admin
const superAdminOnly = (req, res, next) => {
    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Access denied. Super Admin only.' });
    }
    next();
};

// GET /api/superadmin/companies
router.get('/companies', superAdminOnly, async (req, res) => {
    try {
        const companies = await prisma.companies.findMany({
            include: {
                _count: {
                    select: { users: true, orders: true, vehicles: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(companies);
    } catch (err) {
        console.error("SuperAdmin Companies Error:", err);
        res.status(500).json({ error: 'Failed to fetch companies' });
    }
});

// GET /api/superadmin/metrics
router.get('/metrics', superAdminOnly, async (req, res) => {
    try {
        const totalCompanies = await prisma.companies.count();
        const activeCompanies = await prisma.companies.count({ where: { status: 'ACTIVE' } });
        
        // Approximate MRR based on subscription tier (mock data mapping)
        const companies = await prisma.companies.findMany({ select: { subscription_tier: true } });
        let mrr = 0;
        companies.forEach(c => {
            if (c.subscription_tier === 'PRO') mrr += 49;
            // Add other tiers if they exist
        });

        res.json({
            total_companies: totalCompanies,
            active_companies: activeCompanies,
            mrr: mrr
        });
    } catch (err) {
        console.error("SuperAdmin Metrics Error:", err);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});

// POST /api/superadmin/companies/:id/suspend
router.post('/companies/:id/suspend', superAdminOnly, async (req, res) => {
    try {
        const companyId = parseInt(req.params.id);
        const { suspend } = req.body; // true to suspend, false to activate

        const company = await prisma.companies.update({
            where: { id: companyId },
            data: { status: suspend ? 'SUSPENDED' : 'ACTIVE' }
        });

        res.json(company);
    } catch (err) {
        console.error("SuperAdmin Suspend Error:", err);
        res.status(500).json({ error: 'Failed to update company status' });
    }
});

module.exports = router;
