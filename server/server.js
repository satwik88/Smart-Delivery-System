const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/network', require('./routes/network.routes'));
app.use('/api/routing', require('./routes/routing.routes'));
app.use('/api/connectivity', require('./routes/connectivity.routes'));
app.use('/api/scheduling', require('./routes/scheduling.routes'));
app.use('/api/cargo', require('./routes/cargo.routes'));
app.use('/api/resources', require('./routes/resources.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/sorting', require('./routes/sorting.routes'));
app.use('/api/placement', require('./routes/placement.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/track', require('./routes/track.routes'));

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SLRROS API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
