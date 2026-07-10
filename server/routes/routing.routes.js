const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { dijkstra } = require('../algorithms/dijkstra');
const { floydWarshall } = require('../algorithms/floydWarshall');

// Compute shortest path (Dijkstra)
router.post('/shortest-path', async (req, res) => {
    const { sourceId, destId } = req.body;
    const companyId = req.user.company_id;
    try {
        const nodes = await prisma.warehouses.findMany({
            where: { company_id: companyId }
        });
        
        const dbEdges = await prisma.roads.findMany({
            where: { company_id: companyId },
            select: { from_id: true, to_id: true, distance: true }
        });
        const edges = dbEdges.map(e => ({ from: e.from_id, to: e.to_id, weight: e.distance }));
        
        const result = dijkstra(nodes, edges, parseInt(sourceId), parseInt(destId));

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'dijkstra',
                dataset_size: nodes.length,
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

// Compute APSP (Floyd-Warshall)
router.get('/apsp', async (req, res) => {
    const companyId = req.user.company_id;
    try {
        const nodes = await prisma.warehouses.findMany({
            where: { company_id: companyId },
            select: { id: true, name: true },
            orderBy: { id: 'asc' }
        });
        
        const edges = await prisma.roads.findMany({
            where: { company_id: companyId },
            select: { from_id: true, to_id: true, distance: true }
        });
        
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
            if(u !== undefined && v !== undefined) {
                distMatrix[u][v] = e.distance;
                distMatrix[v][u] = e.distance; // Assuming undirected roads
            }
        });

        const result = floydWarshall(distMatrix, nodeIds);

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'floydWarshall',
                dataset_size: nodes.length,
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
