const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET unique customers from orders (since we don't have a customers table yet)
router.get('/', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        
        // Use group by to get unique customers
        const customers = await prisma.orders.groupBy({
            by: ['customer_name'],
            where: { company_id: companyId },
            _count: { id: true },
            _sum: { budget: true },
            _max: { created_at: true }
        });
        
        const formatted = customers.map(c => ({
            name: c.customer_name,
            totalOrders: c._count.id,
            totalSpent: c._sum.budget,
            lastActive: c._max.created_at
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
