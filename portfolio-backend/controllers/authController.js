const { validationResult } = require('express-validator');
const { findUserByEmail, createUser, validatePassword } = require('../models/userModel');
const { generateToken } = require('../utils/tokenUtils');
const config = require('../config/serverConfig');

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = await createUser(name, email, password);
        res.json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await findUserByEmail(email);

        if (!user || !validatePassword(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const userObj = { id: user.id, name: user.name, email: user.email, role: user.role };
        const token = generateToken(userObj, config.jwtSecret);
        res.json({ message: 'Login successful.', token, user: userObj });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    register,
    login,
};
