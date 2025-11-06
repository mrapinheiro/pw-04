import React from 'react';
import { Link } from 'react-router-dom';
import './portfolio.css';

const Project2 = () => {
    return (
        <div>
            <header style={{ background: '#333', color: 'white', padding: '2rem', textAlign: 'center' }}>
                <h1>Portfolio Website</h1>
            </header>
            <section className="section">
                <p>A responsive personal portfolio website built with React, showcasing projects, skills, and professional information. Includes smooth navigation, contact forms, and optimized for both desktop and mobile devices.</p>
                <p>Download coming soon</p>
                <Link to="/" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Portfolio</Link>
            </section>
            <footer style={{ background: '#333', color: 'white', textAlign: 'center', padding: '1rem' }}>
                <p>&copy; 2025 Mario Pinheiro - 30015420</p>
            </footer>
        </div>
    );
};

export default Project2;
