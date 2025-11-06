const { query } = require('../utils/database');

const getAllProjects = async () => {
    try {
        const rows = await query('SELECT id, title, description, tech FROM projects ORDER BY id ASC');
        console.log('Raw data from DB:', JSON.stringify(rows, null, 2));
        // Convert JSON string back to array for tech field
        return rows.map(project => {
            console.log('Processing project:', project.id, 'tech raw:', project.tech, 'type:', typeof project.tech);
            let techArray = [];
            try {
                if (typeof project.tech === 'string') {
                    techArray = JSON.parse(project.tech);
                } else if (Array.isArray(project.tech)) {
                    techArray = project.tech;
                } else if (project.tech) {
                    techArray = [project.tech]; // fallback
                }
            } catch (parseError) {
                console.error('Error parsing tech JSON:', parseError, 'Raw value:', project.tech);
                techArray = [];
            }
            return {
                ...project,
                tech: techArray
            };
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

const addProject = async (newProject) => {
    try {
        // Convert tech array to JSON string for storage
        const techJson = JSON.stringify(newProject.tech || []);
        const result = await query(
            'INSERT INTO projects (title, description, tech) VALUES (?, ?, ?)',
            [newProject.title, newProject.description, techJson]
        );

        return {
            id: result.insertId,
            ...newProject,
            tech: newProject.tech || []
        };
    } catch (error) {
        console.error('Error adding project:', error);
        throw error;
    }
};

const findProjectById = async (id) => {
    try {
        const rows = await query('SELECT id, title, description, tech FROM projects WHERE id = ?', [id]);
        if (rows.length === 0) {
            return null;
        }
        const project = rows[0];
        // Convert JSON string back to array for tech field
        let techArray = [];
        try {
            if (typeof project.tech === 'string') {
                techArray = JSON.parse(project.tech);
            } else if (Array.isArray(project.tech)) {
                techArray = project.tech;
            } else if (project.tech) {
                techArray = [project.tech];
            }
        } catch (parseError) {
            console.error('Error parsing tech JSON:', parseError, 'Raw value:', project.tech);
            techArray = [];
        }
        return {
            ...project,
            tech: techArray
        };
    } catch (error) {
        console.error('Error finding project by id:', error);
        throw error;
    }
};

module.exports = {
    getAllProjects,
    addProject,
    findProjectById,
};
