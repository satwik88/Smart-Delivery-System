const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { selectionSort, quickSort, mergeSort } = require('../algorithms/sorts');

// Run Sorts
router.post('/benchmark', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { datasetType, sortKey } = req.body; // 'deliveries', 'packages', 'warehouses'
        
        let data = [];
        if (datasetType === 'deliveries') {
            // Mock deliveries for sorting
            data = [
                { id: 'D1', destination: 'Warehouse C', distance: 8, priority: 2 },
                { id: 'D2', destination: 'Warehouse F', distance: 11, priority: 1 },
                { id: 'D3', destination: 'Warehouse H', distance: 14, priority: 3 },
                { id: 'D4', destination: 'Warehouse G', distance: 7, priority: 1 },
                { id: 'D5', destination: 'Warehouse D', distance: 6, priority: 2 },
                { id: 'D6', destination: 'Warehouse E', distance: 5, priority: 3 }
            ];
        } else if (datasetType === 'packages') {
            data = await prisma.packages.findMany({ where: { company_id: companyId } });
        } else if (datasetType === 'warehouses') {
            data = await prisma.warehouses.findMany({ where: { company_id: companyId } });
        } else {
            return res.status(400).json({ error: 'Invalid datasetType' });
        }

        const selResult = selectionSort(data, sortKey || 'id');
        const qResult = quickSort(data, sortKey || 'id');
        const mResult = mergeSort(data, sortKey || 'id');

        await prisma.benchmark_results.createMany({
            data: [
                {
                    company_id: companyId, algorithm_name: 'selectionSort', dataset_size: data.length, 
                    comparisons: selResult.metrics.comparisons, swaps: selResult.metrics.swaps, time_ms: selResult.metrics.time
                },
                {
                    company_id: companyId, algorithm_name: 'quickSort', dataset_size: data.length, 
                    comparisons: qResult.metrics.comparisons, swaps: qResult.metrics.swaps, time_ms: qResult.metrics.time
                },
                {
                    company_id: companyId, algorithm_name: 'mergeSort', dataset_size: data.length, 
                    comparisons: mResult.metrics.comparisons, swaps: mResult.metrics.swaps, time_ms: mResult.metrics.time
                }
            ]
        });

        res.json({
            selection: selResult,
            quick: qResult,
            merge: mResult
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
