const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { kruskal } = require('../algorithms/kruskal');
const { prim } = require('../algorithms/prim');

// GET all warehouses
router.get('/warehouses', async (req, res) => {
    try {
        const rows = await prisma.warehouses.findMany({
            where: { company_id: req.user.company_id }
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update warehouse
router.put('/warehouses/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const companyId = req.user.company_id;
        const { address, capacity_sqft, manager_name, status } = req.body;

        const warehouse = await prisma.warehouses.updateMany({
            where: { id, company_id: companyId },
            data: {
                address: address !== undefined ? address : undefined,
                capacity_sqft: capacity_sqft !== undefined ? parseFloat(capacity_sqft) : undefined,
                manager_name: manager_name !== undefined ? manager_name : undefined,
                status: status !== undefined ? status : undefined
            }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all roads
router.get('/roads', async (req, res) => {
    try {
        const rows = await prisma.roads.findMany({
            where: { company_id: req.user.company_id }
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST to calculate MST
router.post('/mst', async (req, res) => {
    const { algorithm } = req.body; // 'kruskal' or 'prim'
    const companyId = req.user.company_id;
    try {
        const nodes = await prisma.warehouses.findMany({
            where: { company_id: companyId }
        });
        
        const dbEdges = await prisma.roads.findMany({
            where: { company_id: companyId },
            select: { id: true, from_id: true, to_id: true, distance: true }
        });
        
        const edges = dbEdges.map(e => ({ id: e.id, from: e.from_id, to: e.to_id, weight: e.distance }));
        
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
        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: algorithm,
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
