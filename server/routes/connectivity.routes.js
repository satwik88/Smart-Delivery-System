const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { warshall } = require('../algorithms/warshall');

// Compute reachability (Warshall)
router.get('/reachability', async (req, res) => {
    try {
        const [nodes] = await db.query('SELECT id FROM warehouses ORDER BY id');
        const [edges] = await db.query('SELECT from_id, to_id FROM roads');
        
        const n = nodes.length;
        const nodeIds = nodes.map(n => n.id);
        const nodeIndex = {};
        nodeIds.forEach((id, i) => nodeIndex[id] = i);

        // Build boolean adjacency matrix
        const adjMatrix = Array.from({ length: n }, () => Array(n).fill(false));
        for(let i=0; i<n; i++) adjMatrix[i][i] = true;

        edges.forEach(e => {
            const u = nodeIndex[e.from_id];
            const v = nodeIndex[e.to_id];
            adjMatrix[u][v] = true;
            adjMatrix[v][u] = true; // Assuming undirected
        });

        const result = warshall(adjMatrix, nodeIds);

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['warshall', nodes.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
