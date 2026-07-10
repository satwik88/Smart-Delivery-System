const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { topoSort } = require('../algorithms/topoSort');

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const tasks = await prisma.tasks.findMany({ where: { company_id: companyId } });
        const dbEdges = await prisma.task_edges.findMany({
            where: { company_id: companyId },
            select: { from_task_id: true, to_task_id: true }
        });
        const edges = dbEdges.map(e => ({ from: e.from_task_id, to: e.to_task_id }));
        res.json({ tasks, edges });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Run Topological Sort
router.post('/schedule', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const tasks = await prisma.tasks.findMany({
            where: { company_id: companyId },
            select: { id: true, name: true }
        });
        const dbEdges = await prisma.task_edges.findMany({
            where: { company_id: companyId },
            select: { from_task_id: true, to_task_id: true }
        });
        const edges = dbEdges.map(e => ({ from: e.from_task_id, to: e.to_task_id }));
        
        const result = topoSort(tasks, edges);

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'topoSort',
                dataset_size: tasks.length,
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
