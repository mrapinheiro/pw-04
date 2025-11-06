import React from 'react';
import { Link } from 'react-router-dom';
import './portfolio.css';

const Project3 = () => {
    return (
        <div>
            <header style={{ background: '#333', color: 'white', padding: '2rem', textAlign: 'center' }}>
                <h1>Weather App</h1>
            </header>
            <section className="section">
                <p>A responsive weather application that fetches real-time weather data using external APIs. Built with JavaScript and styled with CSS, it features location-based weather forecasts, search functionality, and a clean user interface.</p>
                <p>Download Coming Soon</p>
                <Link to="/" style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Portfolio</Link>
            </section>
            <footer style={{ background: '#333', color: 'white', textAlign: 'center', padding: '1rem' }}>
                <p>&copy; 2025 Mario Pinheiro - 30015420</p>
            </footer>
        </div>
    );
};

export default Project3;
