const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET all inventory items across all warehouses for the company
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const items = await prisma.inventory_items.findMany({
            where: { company_id: companyId },
            include: { warehouse: true },
            orderBy: { id: 'desc' }
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET inventory by warehouse
router.get('/warehouse/:warehouseId', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const warehouseId = parseInt(req.params.warehouseId);
        const items = await prisma.inventory_items.findMany({
            where: { company_id: companyId, warehouse_id: warehouseId },
            orderBy: { sku: 'asc' }
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new inventory item
router.post('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { warehouse_id, sku, name, description, quantity, reorder_point, cost_price, selling_price } = req.body;

        // Check if SKU exists in the same warehouse
        const existing = await prisma.inventory_items.findFirst({
            where: { company_id: companyId, warehouse_id: parseInt(warehouse_id), sku }
        });

        if (existing) {
            return res.status(400).json({ error: 'SKU already exists in this warehouse.' });
        }

        const item = await prisma.inventory_items.create({
            data: {
                company_id: companyId,
                warehouse_id: parseInt(warehouse_id),
                sku,
                name,
                description,
                quantity: parseInt(quantity) || 0,
                reorder_point: parseInt(reorder_point) || 10,
                cost_price: parseFloat(cost_price) || 0,
                selling_price: parseFloat(selling_price) || 0
            }
        });

        // Log initial stock as IN transaction
        if (item.quantity > 0) {
            await prisma.inventory_transactions.create({
                data: {
                    company_id: companyId,
                    item_id: item.id,
                    type: 'IN',
                    quantity_change: item.quantity,
                    previous_quantity: 0,
                    new_quantity: item.quantity,
                    user_id: req.user.id,
                    notes: 'Initial stock setup'
                }
            });
        }

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST stock adjustment
router.post('/:id/adjust', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        const { change_amount, reason } = req.body; // change_amount can be negative or positive

        const item = await prisma.inventory_items.findFirst({ where: { id, company_id: companyId } });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const amount = parseInt(change_amount);
        if (isNaN(amount) || amount === 0) return res.status(400).json({ error: 'Valid change_amount is required' });

        const newQuantity = item.quantity + amount;
        if (newQuantity < 0) {
            return res.status(400).json({ error: 'Stock cannot go below 0' });
        }

        const type = amount > 0 ? 'IN' : 'OUT';

        const updatedItem = await prisma.inventory_items.update({
            where: { id },
            data: { quantity: newQuantity }
        });

        const transaction = await prisma.inventory_transactions.create({
            data: {
                company_id: companyId,
                item_id: id,
                type: 'ADJUSTMENT', // we can use IN/OUT or ADJUSTMENT, we will use ADJUSTMENT for manual overrides
                quantity_change: amount,
                previous_quantity: item.quantity,
                new_quantity: newQuantity,
                user_id: req.user.id,
                notes: reason || 'Manual adjustment'
            }
        });

        res.json({ item: updatedItem, transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET inventory transactions for an item
router.get('/:id/transactions', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const id = parseInt(req.params.id);
        
        // Verify item belongs to company
        const item = await prisma.inventory_items.findFirst({ where: { id, company_id: companyId } });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const transactions = await prisma.inventory_transactions.findMany({
            where: { item_id: id },
            orderBy: { created_at: 'desc' },
            include: { user: { select: { id: true, username: true } } }
        });

        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
