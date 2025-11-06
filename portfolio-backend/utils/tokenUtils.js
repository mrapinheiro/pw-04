const jwt = require('jsonwebtoken');

const generateToken = (payload, secret) => {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
};

module.exports = {
    generateToken,
};
