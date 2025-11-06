const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Register route
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 1 }).withMessage('Password must be at least 1 character'),
], register);

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty(),
], login);

module.exports = router;
