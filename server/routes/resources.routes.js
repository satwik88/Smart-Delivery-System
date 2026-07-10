const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { fractionalKnapsack } = require('../algorithms/fractionalKnapsack');

// Run Fractional Knapsack
router.post('/allocate', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { resourceCapacity } = req.body;
        if (!resourceCapacity) return res.status(400).json({ error: 'resourceCapacity is required' });

        const resources = await prisma.resources.findMany({
            where: { company_id: companyId }
        });
        
        const result = fractionalKnapsack(resources, parseFloat(resourceCapacity));

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'fractionalKnapsack',
                dataset_size: resources.length,
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
