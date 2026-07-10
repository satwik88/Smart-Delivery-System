const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { subsetSum } = require('../algorithms/subsetSum');

// Run Subset Sum
router.post('/combinations', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { budget } = req.body;
        if (!budget) return res.status(400).json({ error: 'budget is required' });

        const items = await prisma.order_items.findMany({
            where: { company_id: companyId }
        });
        const prices = items.map(item => item.price);
        
        const result = subsetSum(prices, parseFloat(budget));

        await prisma.benchmark_results.create({
            data: {
                company_id: companyId,
                algorithm_name: 'subsetSum',
                dataset_size: prices.length,
                comparisons: result.metrics.comparisons,
                swaps: result.metrics.swaps,
                time_ms: result.metrics.time
            }
        });

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

// GET all orders
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const orders = await prisma.orders.findMany({
            where: { company_id: companyId },
            include: { vehicle: true, source_warehouse: true, dest_warehouse: true },
            orderBy: { id: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const order = await prisma.orders.findFirst({
            where: { id, company_id: companyId },
            include: { vehicle: true, source_warehouse: true, dest_warehouse: true }
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new order
router.post('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { customer_name, budget, source_warehouse_id, dest_warehouse_id, vehicle_id } = req.body;
        
        const order = await prisma.orders.create({
            data: {
                company_id: companyId,
                customer_name: customer_name || 'Walk-in Customer',
                budget: parseFloat(budget) || 0,
                source_warehouse_id: source_warehouse_id ? parseInt(source_warehouse_id) : null,
                dest_warehouse_id: dest_warehouse_id ? parseInt(dest_warehouse_id) : null,
                vehicle_id: vehicle_id ? parseInt(vehicle_id) : null,
                tracking_code: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                status: 'placed'
            }
        });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update order
router.put('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { status, vehicle_id, progress_pct } = req.body;
        
        // Ensure it belongs to company
        const existing = await prisma.orders.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Order not found' });

        const order = await prisma.orders.update({
            where: { id },
            data: {
                status: status || existing.status,
                vehicle_id: vehicle_id ? parseInt(vehicle_id) : existing.vehicle_id,
                progress_pct: progress_pct !== undefined ? parseFloat(progress_pct) : existing.progress_pct
            }
        });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE order
router.delete('/:id', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        
        const existing = await prisma.orders.findFirst({ where: { id, company_id: companyId } });
        if (!existing) return res.status(404).json({ error: 'Order not found' });

        await prisma.orders.delete({ where: { id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
