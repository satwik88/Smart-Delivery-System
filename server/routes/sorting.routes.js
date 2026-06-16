const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { selectionSort, quickSort, mergeSort } = require('../algorithms/sorts');

// Run Sorts
router.post('/benchmark', async (req, res) => {
    try {
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
            const [rows] = await db.query('SELECT * FROM packages');
            data = rows;
        } else if (datasetType === 'warehouses') {
            const [rows] = await db.query('SELECT * FROM warehouses');
            data = rows;
        } else {
            return res.status(400).json({ error: 'Invalid datasetType' });
        }

        const selResult = selectionSort(data, sortKey || 'id');
        const qResult = quickSort(data, sortKey || 'id');
        const mResult = mergeSort(data, sortKey || 'id');

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
            [
                'selectionSort', data.length, selResult.metrics.comparisons, selResult.metrics.swaps, selResult.metrics.time,
                'quickSort', data.length, qResult.metrics.comparisons, qResult.metrics.swaps, qResult.metrics.time,
                'mergeSort', data.length, mResult.metrics.comparisons, mResult.metrics.swaps, mResult.metrics.time
            ]
        );

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
