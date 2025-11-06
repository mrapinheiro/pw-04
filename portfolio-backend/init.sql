-- Create database if it doesn't exist (though docker-compose should handle this)
CREATE DATABASE IF NOT EXISTS portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add index for email lookups (though UNIQUE creates it, this makes it explicit)
CREATE INDEX idx_email ON users (email);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2b$10$msC1HMwpBOGVjuPduZpLO.tOjh8zDK9poanhE10cFrXNUN4QlXaZ2', 'admin');

-- Insert sample projects
INSERT IGNORE INTO projects (title, description, tech) VALUES
('React Portfolio Website', 'A responsive portfolio site built with React, showcasing skills, projects, and contact information.', JSON_ARRAY('React', 'CSS', 'JavaScript')),
('Node.js Backend API', 'A RESTful API server using Node.js and Express, with authentication and dynamic data handling.', JSON_ARRAY('Node.js', 'Express', 'JWT')),
('Full-Stack E-commerce App', 'An end-to-end e-commerce application with user management, product catalog, and payment integration.', JSON_ARRAY('React', 'Node.js', 'MongoDB', 'Stripe'));
