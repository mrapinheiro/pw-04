const express = require('express');
const cors = require('cors');
const { testConnection } = require('./utils/database');
const config = require('./config/serverConfig');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Dashboard route
app.get('/api/dashboard', require('./middleware/authMiddleware'), (req, res) => {
    res.json({ message: `Welcome to the dashboard, ${req.user.username}! Role: ${req.user.role}` });
});

// Basic route
app.get('/', (req, res) => {
    res.send('Portfolio Backend API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = config.port;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Test database connection
    const isConnected = await testConnection();
    if (isConnected) {
        console.log('? Database connection established successfully');
    } else {
        console.error('? Database connection failed');
    }
});

module.exports = app;
