const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { nQueens } = require('../algorithms/nQueens');

// Run N-Queens
router.post('/place', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { n } = req.body;
        if (!n || n <= 0) return res.status(400).json({ error: 'Valid grid size n is required' });

        const result = nQueens(parseInt(n));

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'nQueens',
                dataset_size: n,
                comparisons: result.metrics.comparisons,
                swaps: result.metrics.swaps,
                time_ms: result.metrics.time
            }
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
