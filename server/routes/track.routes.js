const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { dijkstra } = require('../algorithms/dijkstra');

router.get('/:trackingCode', async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const { trackingCode } = req.params;
        
        const order = await prisma.orders.findFirst({
            where: { company_id: companyId, tracking_code: trackingCode },
            include: { vehicle: true }
        });
        
        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        // Fetch nodes and edges to run Dijkstra
        const nodes = await prisma.warehouses.findMany({ where: { company_id: companyId } });
        const dbEdges = await prisma.roads.findMany({
            where: { company_id: companyId },
            select: { from_id: true, to_id: true, distance: true }
        });
        const edges = dbEdges.map(e => ({ from: e.from_id, to: e.to_id, weight: e.distance }));
        
        let routeNodes = [];
        let totalDistance = 0;

        if (order.source_warehouse_id && order.dest_warehouse_id) {
            const result = dijkstra(nodes, edges, order.source_warehouse_id, order.dest_warehouse_id);
            if (result && result.result && result.result.path) {
                // map path IDs to node objects
                routeNodes = result.result.path.map(id => nodes.find(n => n.id === id));
                totalDistance = result.result.distance;
            }
        }

        const taskSequence = ["Receive Order","Verify Payment","Check Inventory","Package Item","Assign Vehicle","Dispatch","Deliver","Send Invoice"];
        let currentTaskIndex = 0;
        
        switch(order.status) {
            case 'placed': currentTaskIndex = 0; break;
            case 'verified': currentTaskIndex = 1; break;
            case 'packed': currentTaskIndex = 3; break;
            case 'dispatched': currentTaskIndex = 5; break;
            case 'in_transit': currentTaskIndex = 5; break;
            case 'delivered': currentTaskIndex = 7; break;
        }

        const source = nodes.find(n => n.id === order.source_warehouse_id);
        const destination = nodes.find(n => n.id === order.dest_warehouse_id);

        res.json({
            orderId: order.id,
            customerName: order.customer_name,
            source,
            destination,
            route: routeNodes,
            totalDistance,
            progressPct: order.progress_pct,
            status: order.status,
            taskSequence,
            currentTaskIndex,
            vehicleName: order.vehicle ? order.vehicle.name : null
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
