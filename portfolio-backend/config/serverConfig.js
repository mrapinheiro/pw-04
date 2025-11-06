require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'portfolio_user',
        password: process.env.DB_PASSWORD || 'portfolio_pass',
        database: process.env.DB_NAME || 'portfolio',
        port: process.env.DB_PORT || 3307,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
};
