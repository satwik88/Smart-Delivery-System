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

// GET /api/ai/insights
router.get('/insights', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        
        // 1. Gather Context
        const activeOrders = await prisma.orders.count({ where: { company_id: companyId, status: { in: ['placed', 'verified', 'packed', 'in_transit'] } } });
        const delayedOrders = await prisma.orders.count({ where: { company_id: companyId, is_delayed: true } });
        
        const vehicles = await prisma.vehicles.findMany({ where: { company_id: companyId } });
        const activeVehicles = vehicles.filter(v => v.status === 'ACTIVE').length;
        const maintenanceVehicles = vehicles.filter(v => v.status === 'IN_MAINTENANCE').length;
        
        const inventory = await prisma.inventory_items.findMany({ where: { company_id: companyId } });
        const lowStockItems = inventory.filter(i => i.quantity <= i.reorder_point);
        const lowStockCount = lowStockItems.length;

        // 2. We will use Gemini if API key is present, otherwise fallback to heuristics
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const prompt = `
            You are an AI Operations manager for a logistics company. Analyze the following live data and provide exactly 3 strategic, actionable insights to optimize operations.

            Data Context:
            - Active Orders: ${activeOrders}
            - Delayed Orders: ${delayedOrders}
            - Fleet: ${activeVehicles} active vehicles, ${maintenanceVehicles} in maintenance.
            - Inventory: ${lowStockCount} items currently below reorder threshold.
            ${lowStockCount > 0 ? `- Low Stock SKUs: ${lowStockItems.map(i => i.sku).join(', ')}` : ''}

            Format your response as a JSON array of objects, where each object has:
            - "title": A short, punchy title (max 5 words)
            - "description": A detailed, actionable recommendation (1-2 sentences)
            - "type": One of "WARNING", "INFO", or "SUCCESS"
            
            Example:
            [
              { "title": "Re-route Fleet", "description": "High order volume detected...", "type": "INFO" }
            ]
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            try {
                // Try to parse the JSON output from Gemini
                const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                const insights = JSON.parse(cleanedText);
                return res.json({ insights, metrics: { activeOrders, delayedOrders, activeVehicles, lowStockCount } });
            } catch (parseError) {
                console.error("Failed to parse Gemini response as JSON:", responseText);
                // Fallback if parsing fails
            }
        }
        
        // 3. Fallback Heuristics
        const insights = [
            {
                title: "Fleet Optimization",
                description: `${activeVehicles} vehicles are on active duty. Ensure all routes are optimized for current traffic.`,
                type: "INFO"
            }
        ];
        
        if (lowStockCount > 0) {
            insights.push({
                title: "Critical Restock Needed",
                description: `You have ${lowStockCount} SKUs below minimum reorder points. Replenish immediately.`,
                type: "WARNING"
            });
        }
        
        if (delayedOrders > 0) {
            insights.push({
                title: "Order Delays Detected",
                description: `${delayedOrders} orders are marked as delayed. Consider re-assigning drivers to these routes.`,
                type: "WARNING"
            });
        }
        
        if (insights.length < 3) {
            insights.push({
                title: "System Nominal",
                description: "All core logistics operations are running smoothly without critical issues.",
                type: "SUCCESS"
            });
        }

        res.json({ insights: insights.slice(0, 3), metrics: { activeOrders, delayedOrders, activeVehicles, lowStockCount } });
    } catch (err) {
        console.error("AI Insights Error:", err);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

module.exports = router;
