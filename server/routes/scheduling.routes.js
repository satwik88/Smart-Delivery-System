const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { topoSort } = require('../algorithms/topoSort');

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const [tasks] = await db.query('SELECT * FROM tasks');
        const [edges] = await db.query('SELECT from_task_id as `from`, to_task_id as `to` FROM task_edges');
        res.json({ tasks, edges });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Run Topological Sort
router.post('/schedule', async (req, res) => {
    try {
        const [tasks] = await db.query('SELECT id, name FROM tasks');
        const [edges] = await db.query('SELECT from_task_id as `from`, to_task_id as `to` FROM task_edges');
        
        const result = topoSort(tasks, edges);

        await db.query(
            'INSERT INTO benchmark_results (algorithm_name, dataset_size, comparisons, swaps, time_ms) VALUES (?, ?, ?, ?, ?)',
            ['topoSort', tasks.length, result.metrics.comparisons, result.metrics.swaps, result.metrics.time]
        );

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
