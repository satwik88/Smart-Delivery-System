const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { nQueens } = require('../algorithms/nQueens');

// Run N-Queens
router.post('/place', async (req, res) => {
    try {
        const { n } = req.body;
        if (!n || n <= 0) return res.status(400).json({ error: 'Valid grid size n is required' });

        const result = nQueens(parseInt(n));

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['nQueens', n, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
