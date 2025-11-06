const bcrypt = require('bcryptjs');
const { query } = require('../utils/database');

const findUserByUsername = async (username) => {
    try {
        // Since we're using email auth, this function is unused but kept for compatibility
        // Returns null for username lookups
        return null;
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};

const findUserByEmail = async (email) => {
    try {
        const rows = await query('SELECT id, email, password, role, name FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    }
};

const createUser = async (name, email, password, role = 'user') => {
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = await query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        return {
            id: result.insertId,
            name,
            email,
            role
        };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const validatePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
    findUserByUsername,
    findUserByEmail,
    createUser,
    validatePassword,
};
