const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// Middleware to ensure user is a customer
const customerOnly = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({ error: 'Access denied. Customer only.' });
    }
    next();
};

// GET /api/customer/orders
router.get('/orders', customerOnly, async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const customerId = req.user.id;

        const orders = await prisma.orders.findMany({
            where: {
                company_id: companyId,
                customer_id: customerId
            },
            include: {
                order_items: true,
                events: { orderBy: { created_at: 'desc' } }
            },
            orderBy: { created_at: 'desc' }
        });

        res.json(orders);
    } catch (err) {
        console.error("Customer Orders Error:", err);
        res.status(500).json({ error: 'Failed to fetch customer orders' });
    }
});

// GET /api/customer/orders/:id
router.get('/orders/:id', customerOnly, async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const customerId = req.user.id;
        const orderId = parseInt(req.params.id);

        const order = await prisma.orders.findFirst({
            where: {
                id: orderId,
                company_id: companyId,
                customer_id: customerId
            },
            include: {
                order_items: true,
                events: { orderBy: { created_at: 'desc' } },
                vehicle: {
                    select: {
                        name: true,
                        current_location_lat: true,
                        current_location_lng: true
                    }
                }
            }
        });

        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error("Customer Order Detail Error:", err);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

module.exports = router;
