const jwt = require('jsonwebtoken');

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

        // Start simulator for this company if not already running
        if (!activeSimulators[companyId]) {
            startSimulationForCompany(io, companyId);
        }

        socket.on('disconnect', () => {
            console.log(`User ${socket.user.username} disconnected`);
        });
    });
}

function startSimulationForCompany(io, companyId) {
    const roomName = `company_${companyId}`;
    
    // Simulate 3 active drivers starting near a central point (New Delhi, old mock)
    const drivers = [
        { id: 'DRV-1001', name: 'Aman (Truck 1)', pos: [28.59, 77.25], status: 'Out for Delivery' },
        { id: 'DRV-1002', name: 'Priya (Van 2)', pos: [28.57, 77.32], status: 'Returning to Hub' },
        { id: 'DRV-1003', name: 'Rahul (Bike 1)', pos: [28.55, 77.28], status: 'Out for Delivery' }
    ];

    console.log(`Starting live ops simulator for company ${companyId}`);

    const intervalId = setInterval(() => {
        // Move each driver randomly
        drivers.forEach(d => {
            d.pos[0] += (Math.random() - 0.5) * 0.002;
            d.pos[1] += (Math.random() - 0.5) * 0.002;
        });

        // Broadcast to all admins in the company
        io.to(roomName).emit('driver_locations', drivers);
    }, 2000);

    activeSimulators[companyId] = intervalId;
}

module.exports = {
    initLiveTracking
};
