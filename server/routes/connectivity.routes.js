const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { warshall } = require('../algorithms/warshall');

// Compute reachability (Warshall)
router.get('/reachability', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const nodes = await prisma.warehouses.findMany({
            where: { company_id: companyId },
            select: { id: true },
            orderBy: { id: 'asc' }
        });
        const edges = await prisma.roads.findMany({
            where: { company_id: companyId },
            select: { from_id: true, to_id: true }
        });
        
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
            if(u !== undefined && v !== undefined) {
                adjMatrix[u][v] = true;
                adjMatrix[v][u] = true; // Assuming undirected
            }
        });

        const result = warshall(adjMatrix, nodeIds);

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'warshall',
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
