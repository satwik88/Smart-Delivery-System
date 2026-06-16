const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { kruskal } = require('../algorithms/kruskal');
const { prim } = require('../algorithms/prim');

// GET all warehouses
router.get('/warehouses', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM warehouses');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all roads
router.get('/roads', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM roads');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST to calculate MST
router.post('/mst', async (req, res) => {
    const { algorithm } = req.body; // 'kruskal' or 'prim'
    try {
        const [nodes] = await db.query('SELECT * FROM warehouses');
        const [edges] = await db.query('SELECT id, from_id as `from`, to_id as `to`, distance as weight FROM roads');
        
        let result;
        if (algorithm === 'kruskal') {
            result = kruskal(nodes, edges);
        } else if (algorithm === 'prim') {
            const startNodeId = nodes.length > 0 ? nodes[0].id : null;
            if (!startNodeId) return res.status(400).json({ error: 'No warehouses found' });
            result = prim(nodes, edges, startNodeId);
        } else {
            return res.status(400).json({ error: 'Invalid algorithm specified' });
        }

        // Log benchmark
        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            [algorithm, nodes.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
