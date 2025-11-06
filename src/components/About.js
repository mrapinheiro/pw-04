import React from 'react';

const About = () => {
    return (
        <section id="about" className="section">
            <h2>About Me</h2>
            <div className="about-container">
                <img src={`${process.env.PUBLIC_URL}/avatar.png`} alt="Profile" />
                <div>
                    <p>I am a dedicated front-end developer and a student at Universidade Autonoma de Lisboa, with a passion for creating beautiful and functional user interfaces. With experience in modern web technologies, I strive to build applications that provide excellent user experiences.</p>
                </div>
            </div>
        </section>
    );
};

export default About;
