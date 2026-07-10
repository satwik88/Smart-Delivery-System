const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// GET /api/finance/summary
router.get('/summary', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        
        // Sum all revenues
        const revenueAgg = await prisma.financial_transactions.aggregate({
            _sum: { amount: true },
            where: { company_id: companyId, type: 'REVENUE' }
        });
        const totalRevenue = revenueAgg._sum.amount || 0;

        // Sum all expenses
        const expenseAgg = await prisma.financial_transactions.aggregate({
            _sum: { amount: true },
            where: { company_id: companyId, type: 'EXPENSE' }
        });
        const totalExpenses = expenseAgg._sum.amount || 0;

        const netProfit = totalRevenue - totalExpenses;

        res.json({
            revenue: totalRevenue,
            expenses: totalExpenses,
            net_profit: netProfit
        });
    } catch (err) {
        console.error("Finance Summary Error:", err);
        res.status(500).json({ error: 'Failed to fetch financial summary' });
    }
});

// GET /api/finance/transactions
router.get('/transactions', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const limit = parseInt(req.query.limit) || 50;

        const transactions = await prisma.financial_transactions.findMany({
            where: { company_id: companyId },
            orderBy: { created_at: 'desc' },
            take: limit
        });

        res.json(transactions);
    } catch (err) {
        console.error("Finance Transactions Error:", err);
        res.status(500).json({ error: 'Failed to fetch financial transactions' });
    }
});

module.exports = router;
