const { validationResult } = require('express-validator');
const { getAllProjects, addProject } = require('../models/projectModel');

const getProjects = async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

const createProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tech } = req.body;

        const newProject = {
            title,
            description,
            tech: Array.isArray(tech) ? tech : []
        };

        const added = await addProject(newProject);
        res.status(201).json(added);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to add project' });
    }
};

module.exports = {
    getProjects,
    createProject,
};
