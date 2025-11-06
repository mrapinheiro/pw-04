import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newProject, setNewProject] = useState({ title: '', description: '', tech: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleAddProject = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in as admin');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newProject.title,
                    description: newProject.description,
                    tech: newProject.tech.split(',').map(t => t.trim()),
                }),
            });
            if (!response.ok) throw new Error('Failed to add project');
            const addedProject = await response.json();
            setProjects([...projects, addedProject]);
            setNewProject({ title: '', description: '', tech: '' });
            setShowForm(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const isAdmin = () => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isAdmin = payload.role === 'admin';
            console.log('Token payload:', payload, 'Is admin:', isAdmin);
            return isAdmin;
        } catch (error) {
            console.error('Token decode error:', error);
            return false;
        }
    };

    if (loading) return <section id="projects" className="section"><p>Loading projects...</p></section>;
    if (error) return <section id="projects" className="section"><p>Error: {error}</p></section>;

    return (
        <section id="projects" className="section">
            <h2>Projects</h2>
            {isAdmin() && (
                <>
                    <button onClick={() => setShowForm(!showForm)} className="add-project-btn">
                        {showForm ? 'Cancel Add Project' : 'Add New Project'}
                    </button>
                    {showForm && (
                        <form onSubmit={handleAddProject} className="add-project-form">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Tech (comma separated)"
                                value={newProject.tech}
                                onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                            />
                            <button type="submit">Add Project</button>
                        </form>
                    )}
                </>
            )}
            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                        <Link to={`/project/${project.id}`} className="view-project-link">View Project</Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
