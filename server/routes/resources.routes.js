const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { fractionalKnapsack } = require('../algorithms/fractionalKnapsack');

// Run Fractional Knapsack
router.post('/allocate', async (req, res) => {
    try {
        const { resourceCapacity } = req.body;
        if (!resourceCapacity) return res.status(400).json({ error: 'resourceCapacity is required' });

        const [resources] = await db.query('SELECT * FROM resources');
        
        const result = fractionalKnapsack(resources, parseFloat(resourceCapacity));

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['fractionalKnapsack', resources.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
