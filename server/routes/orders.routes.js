const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { subsetSum } = require('../algorithms/subsetSum');

// Run Subset Sum
router.post('/combinations', async (req, res) => {
    try {
        const { budget } = req.body;
        if (!budget) return res.status(400).json({ error: 'budget is required' });

        const [items] = await db.query('SELECT * FROM order_items');
        const prices = items.map(item => item.price);
        
        const result = subsetSum(prices, parseFloat(budget));

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['subsetSum', prices.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        // Optional: Map back prices to products
        const subsetsWithProducts = result.result.subsets.map(subsetPrices => {
            return subsetPrices.map(p => items.find(i => i.price === p));
        });
        
        result.result.subsetsWithProducts = subsetsWithProducts;

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
