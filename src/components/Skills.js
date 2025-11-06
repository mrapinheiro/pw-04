import React from 'react';

const Skills = () => {
    const skills = ["JavaScript", "React", "HTML", "CSS", "Node.js", "Git"];

    return (
        <section id="skills" className="section">
            <h2>Skills</h2>
            <div className="skills-list">
                {skills.map((skill, index) => (
                    <div key={index} className="skill-item">{skill}</div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
