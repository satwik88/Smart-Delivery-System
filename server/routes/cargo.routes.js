const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { knapsack01 } = require('../algorithms/knapsack01');

// Run 0/1 Knapsack
router.post('/optimize', async (req, res) => {
    try {
        const { vehicleCapacity } = req.body;
        if (!vehicleCapacity) return res.status(400).json({ error: 'vehicleCapacity is required' });

        const [packages] = await db.query('SELECT * FROM packages');
        
        const result = knapsack01(packages, parseFloat(vehicleCapacity));

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['knapsack01', packages.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
