const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const companyId = req.user.company_id;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const query = message.toLowerCase();
        let reply = "I'm your AI Dispatch Assistant. How can I help you optimize your fleet today?";

        // Heuristic AI Engine (Simulating LLM awareness)
        if (query.includes('orders') || query.includes('deliveries')) {
            const activeOrders = await prisma.orders.count({
                where: { company_id: companyId, status: { in: ['in_transit', 'packed'] } }
            });
            reply = `You currently have ${activeOrders} active orders in transit or packed. Everything looks on schedule!`;
        } else if (query.includes('driver') || query.includes('fleet')) {
            reply = "Most of your drivers are currently active. Aman (Truck 1) and Rahul (Bike 1) are out for delivery, while Priya (Van 2) is returning to the hub.";
        } else if (query.includes('delay') || query.includes('late')) {
            reply = "I've analyzed the live traffic data. There is a slight delay on Route 4, but all other deliveries are expected to arrive within their SLA windows.";
        } else if (query.includes('hello') || query.includes('hi')) {
            reply = "Hello! I am your AI Dispatch Assistant. I can help you check on your active orders, track drivers, and spot potential delays. What would you like to know?";
        } else if (query.includes('warehouse') || query.includes('hub')) {
            const hubs = await prisma.warehouses.count({ where: { company_id: companyId } });
            reply = `You have ${hubs} operational warehouses in your network. Inventory levels are stable across all locations.`;
        } else {
            reply = "I'm a simulated AI assistant for this demo. I can answer questions about your **orders**, **drivers**, **delays**, or **warehouses**. Try asking 'How many active orders do we have?'";
        }

        // Simulate network/thinking delay for realism
        setTimeout(() => {
            res.json({ reply });
        }, 1500);

    } catch (err) {
        console.error("AI Chat Error:", err);
        res.status(500).json({ error: 'Failed to process AI query' });
    }
});

module.exports = router;
