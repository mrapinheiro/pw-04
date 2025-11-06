import React from 'react';
import { Link } from 'react-router-dom';
import './portfolio.css';

const Project1 = () => {
    return (
        <div>
            <header style={{ background: '#333', color: 'white', padding: '2rem', textAlign: 'center' }}>
                <h1>E-commerce Platform</h1>
            </header>
            <section className="section">
                <p>A comprehensive full-stack e-commerce site built with React for the frontend and Node.js for the backend. Features include user authentication, product listings, shopping cart functionality, and secure payment integration.</p>
                <p>Download Coming Soon</p>
                <Link to="/" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Portfolio</Link>
            </section>
            <footer style={{ background: '#333', color: 'white', textAlign: 'center', padding: '1rem' }}>
                <p>&copy; 2025 Mario Pinheiro - 30015420</p>
            </footer>
        </div>
    );
};

export default Project1;
