const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { knapsack01 } = require('../algorithms/knapsack01');

// Run 0/1 Knapsack
router.post('/optimize', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { vehicleCapacity } = req.body;
        if (!vehicleCapacity) return res.status(400).json({ error: 'vehicleCapacity is required' });

        const packages = await prisma.packages.findMany({
            where: { company_id: companyId }
        });
        
        const result = knapsack01(packages, parseFloat(vehicleCapacity));

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'knapsack01',
                dataset_size: packages.length,
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
