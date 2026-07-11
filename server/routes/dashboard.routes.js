const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Get Dashboard Metrics
router.get('/metrics', async (req, res) => {
    try {
        const companyId = req.user.company_id;

        const totalOrders = await prisma.orders.count({ where: { company_id: companyId } });
        const pendingOrders = await prisma.orders.count({ where: { company_id: companyId, status: { in: ['placed', 'verified', 'packed'] } } });
        const inTransitOrders = await prisma.orders.count({ where: { company_id: companyId, status: 'in_transit' } });
        const deliveredOrders = await prisma.orders.count({ where: { company_id: companyId, status: 'delivered' } });
        
        const revenueAgg = await prisma.orders.aggregate({
            where: { company_id: companyId, status: 'delivered' },
            _sum: { budget: true }
        });

        const activeDrivers = await prisma.users.count({
            where: { company_id: companyId, role: 'driver' } // Assuming drivers exist
        });

        res.json({
            revenue: revenueAgg._sum.budget || 0,
            totalOrders,
            pendingOrders,
            inTransitOrders,
            deliveredOrders,
            activeDrivers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Chart Data
router.get('/chart-data', async (req, res) => {
    try {
        const companyId = req.user.company_id;

        // Grouping orders by day for the last 7 days
        const orders = await prisma.orders.findMany({
            where: { company_id: companyId },
            select: { created_at: true, budget: true, status: true }
        });

        const dataMap = {};
        orders.forEach(o => {
            if(!o.created_at) return;
            const date = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dataMap[date]) dataMap[date] = { date, revenue: 0, orders: 0 };
            dataMap[date].orders += 1;
            if (o.status === 'delivered') dataMap[date].revenue += (o.budget || 0);
        });

        res.json(Object.values(dataMap));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Keep existing summary route for legacy compatibility if needed
router.get('/summary', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const warehouses = await prisma.warehouses.count({ where: { company_id: companyId } });
        const roadsAgg = await prisma.roads.aggregate({ where: { company_id: companyId }, _count: true, _sum: { cost: true } });
        res.json({ warehouses, roads: roadsAgg._count, totalRoadCost: roadsAgg._sum.cost || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Benchmarks
router.get('/benchmarks', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const results = await prisma.benchmark_results.findMany({
            where: { company_id: companyId },
            orderBy: { dataset_size: 'asc' }
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
