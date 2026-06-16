const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { dijkstra } = require('../algorithms/dijkstra');
const { floydWarshall } = require('../algorithms/floydWarshall');

// Compute shortest path (Dijkstra)
router.post('/shortest-path', async (req, res) => {
    const { sourceId, destId } = req.body;
    try {
        const [nodes] = await db.query('SELECT * FROM warehouses');
        const [edges] = await db.query('SELECT from_id as `from`, to_id as `to`, distance as weight FROM roads');
        
        const result = dijkstra(nodes, edges, parseInt(sourceId), parseInt(destId));

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['dijkstra', nodes.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Compute APSP (Floyd-Warshall)
router.get('/apsp', async (req, res) => {
    try {
        const [nodes] = await db.query('SELECT id, name FROM warehouses ORDER BY id');
        const [edges] = await db.query('SELECT from_id, to_id, distance FROM roads');
        
        const n = nodes.length;
        const nodeIds = nodes.map(n => n.id);
        const nodeIndex = {};
        nodeIds.forEach((id, i) => nodeIndex[id] = i);

        // Build distance matrix
        const distMatrix = Array.from({ length: n }, () => Array(n).fill(Infinity));
        for(let i=0; i<n; i++) distMatrix[i][i] = 0;

        edges.forEach(e => {
            const u = nodeIndex[e.from_id];
            const v = nodeIndex[e.to_id];
            distMatrix[u][v] = e.distance;
            distMatrix[v][u] = e.distance; // Assuming undirected roads
        });

        const result = floydWarshall(distMatrix, nodeIds);

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['floydWarshall', nodes.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
