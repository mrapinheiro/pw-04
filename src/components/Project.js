import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Project = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [triggerRender, setTriggerRender] = useState(0);

    const handleLogin = () => {
        setTriggerRender(triggerRender + 1);
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/projects`);
                const projects = await response.json();
                const foundProject = projects.find(p => p.id === parseInt(id));
                if (foundProject) {
                    setProject(foundProject);
                } else {
                    setError('Project not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) return (
        <div>
            <Header onLogin={handleLogin} />
            <div>Loading project...</div>
            <Footer />
        </div>
    );
    if (error) return (
        <div>
            <Header onLogin={handleLogin} />
            <div>Error: {error}</div>
            <Footer />
        </div>
    );
    if (!project) return (
        <div>
            <Header onLogin={handleLogin} />
            <div>Project not found</div>
            <Footer />
        </div>
    );

    return (
        <div>
            <Header onLogin={handleLogin} />
            <div className="project-detail">
                <h1>{project.title}</h1>
                <p>{project.description}</p>
                <h3>Technologies:</h3>
                <ul>
                    {project.tech && project.tech.map((tech, index) => (
                        <li key={index}>{tech}</li>
                    ))}
                </ul>
                <a href="#/" className="back-link">Back to Home</a>
            </div>
            <Footer />
        </div>
    );
};

export default Project;
