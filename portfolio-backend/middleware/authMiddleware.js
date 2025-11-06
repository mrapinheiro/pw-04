const jwt = require('jsonwebtoken');
const config = require('../config/serverConfig');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // Can be old {username, role} or new {id, name, email, role}
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
