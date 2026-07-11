const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());

// Webhook must be parsed as raw body
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }), require('./routes/billing.webhook.routes'));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
const { authMiddleware } = require('./middleware/auth.middleware');

app.use('/api/network', authMiddleware, require('./routes/network.routes'));
app.use('/api/routing', authMiddleware, require('./routes/routing.routes'));
app.use('/api/connectivity', authMiddleware, require('./routes/connectivity.routes'));
app.use('/api/scheduling', authMiddleware, require('./routes/scheduling.routes'));
app.use('/api/cargo', authMiddleware, require('./routes/cargo.routes'));
app.use('/api/resources', authMiddleware, require('./routes/resources.routes'));
app.use('/api/orders', authMiddleware, require('./routes/orders.routes'));
app.use('/api/sorting', authMiddleware, require('./routes/sorting.routes'));
app.use('/api/placement', authMiddleware, require('./routes/placement.routes'));
app.use('/api/dashboard', authMiddleware, require('./routes/dashboard.routes'));
app.use('/api/drivers', authMiddleware, require('./routes/drivers.routes'));
app.use('/api/customers', authMiddleware, require('./routes/customers.routes'));
app.use('/api/admin', authMiddleware, require('./routes/admin.routes'));
app.use('/api/track', authMiddleware, require('./routes/track.routes'));
app.use('/api/billing', authMiddleware, require('./routes/billing.routes'));
app.use('/api/ai', authMiddleware, require('./routes/ai.routes'));
app.use('/api/fleet', authMiddleware, require('./routes/fleet.routes'));
app.use('/api/inventory', authMiddleware, require('./routes/inventory.routes'));
app.use('/api/finance', authMiddleware, require('./routes/finance.routes'));
app.use('/api/customer', authMiddleware, require('./routes/customer.routes'));
app.use('/api/superadmin', authMiddleware, require('./routes/superadmin.routes'));
app.use('/api/dispatch', authMiddleware, require('./routes/dispatch.routes'));
app.use('/api/notifications', authMiddleware, require('./routes/notifications.routes'));

// Mega Phase APIs
app.use('/api/public', require('./routes/public.routes'));
app.use('/api/vision', authMiddleware, require('./routes/vision.routes'));
app.use('/api/telemetry', require('./routes/telemetry.routes'));
app.use('/api/developer', authMiddleware, require('./routes/developer.routes'));
app.use('/api/plugins', authMiddleware, require('./routes/plugins.routes'));
app.use('/api/settings', authMiddleware, require('./routes/settings.routes'));

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SLRROS API is running' });
});

const PORT = process.env.PORT || 5000;

// Initialize live operations engine
const { initLiveTracking } = require('./services/liveTracking');

app.set('io', io);

initLiveTracking(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
