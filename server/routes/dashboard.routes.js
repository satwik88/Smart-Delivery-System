const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get Dashboard Summary
router.get('/summary', async (req, res) => {
    try {
        const [warehouses] = await db.query('SELECT COUNT(*) as count FROM warehouses');
        const [roads] = await db.query('SELECT COUNT(*) as count, SUM(cost) as totalCost FROM roads');
        const [tasks] = await db.query('SELECT COUNT(*) as count FROM tasks');
        const [benchmarks] = await db.query('SELECT algorithm_name, time_ms, comparisons FROM benchmark_results ORDER BY run_at DESC LIMIT 10');
        
        res.json({
            warehouses: warehouses[0].count,
            roads: roads[0].count,
            totalRoadCost: roads[0].totalCost || 0,
            tasks: tasks[0].count,
            recentBenchmarks: benchmarks
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
