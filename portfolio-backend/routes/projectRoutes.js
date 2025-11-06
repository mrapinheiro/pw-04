const express = require('express');
const { body } = require('express-validator');
const { getProjects, createProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// GET /projects - public
router.get('/', getProjects);

// POST /projects - admin only
router.post('/', authMiddleware, roleMiddleware('admin'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('tech').optional().isArray(),
], createProject);

// Add logging middleware for debugging
router.use('/projects', (req, res, next) => {
    if (req.method === 'POST') {
        console.log('POST /projects - req.user:', req.user);
        console.log('POST /projects - body:', req.body);
    }
    next();
});

module.exports = router;
