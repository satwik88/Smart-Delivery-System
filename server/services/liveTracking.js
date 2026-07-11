const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const activeSimulators = {}; // company_id -> intervalId

function initLiveTracking(io) {
    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const companyId = socket.user.company_id;
        const roomName = `company_${companyId}`;
        
        socket.join(roomName);
        console.log(`User ${socket.user.username} connected to live tracking (Room: ${roomName})`);

        // Start simulator/broadcast interval for this company if not already running
        if (!activeSimulators[companyId]) {
            startSimulationForCompany(io, companyId);
        }

        socket.on('disconnect', () => {
            console.log(`User ${socket.user.username} disconnected`);
        });
    });
}

function startSimulationForCompany(io, companyId) {
    console.log(`Starting live ops engine for company ${companyId}`);

    const intervalId = setInterval(async () => {
        await broadcastDriverLocations(io, companyId);
    }, 2000);

    activeSimulators[companyId] = intervalId;
}

async function broadcastDriverLocations(io, companyId) {
    const roomName = `company_${companyId}`;
    try {
        // Query active orders currently in transit
        const activeOrders = await prisma.orders.findMany({
            where: {
                company_id: companyId,
                status: 'in_transit',
                vehicle_id: { not: null }
            },
            include: {
                vehicle: {
                    include: {
                        driver_assignments: {
                            where: { status: 'ACTIVE' },
                            include: { user: true }
                        }
                    }
                },
                source_warehouse: true,
                dest_warehouse: true
            }
        });

        const activeDrivers = activeOrders.map(order => {
            const vehicle = order.vehicle;
            const activeAssignment = vehicle?.driver_assignments?.[0];
            const driverName = activeAssignment?.user?.username || 'Unassigned Driver';

            let lat = vehicle?.current_location_lat;
            let lng = vehicle?.current_location_lng;

            if (!lat || !lng) {
                // Fallback to source warehouse position
                lat = order.source_warehouse?.pos_x || 28.58;
                lng = order.source_warehouse?.pos_y || 77.30;
            }

            return {
                id: `DRV-${activeAssignment?.user?.id || 'V' + (vehicle?.id || order.id)}`,
                name: `${driverName} (${vehicle?.name || 'No Vehicle'})`,
                pos: [lat, lng],
                status: `Delivering ${order.tracking_code}`
            };
        });

        io.to(roomName).emit('driver_locations', activeDrivers);
    } catch (err) {
        console.error("Error broadcasting driver locations:", err);
    }
}

module.exports = {
    initLiveTracking,
    broadcastDriverLocations
};
