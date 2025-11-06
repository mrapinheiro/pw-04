import React, { useState } from 'react';
import Header from './Header';
import About from './About';
import Projects from './Projects';
import Skills from './Skills';
import Demos from './Demos';
import Contact from './Contact';
import Footer from './Footer';
import './portfolio.css';

const Home = () => {
    const [loginTrigger, setLoginTrigger] = useState(0); // to trigger re-render

    const handleLogin = () => {
        setLoginTrigger(loginTrigger + 1); // forces re-render of child components to check admin status
    };

    return (
        <div>
            <Header onLogin={handleLogin} />
            <About />
            <Projects key={loginTrigger} /> {/* force re-render on login */}
            <Skills />
            <Demos />
            <Contact />
            <Footer />
        </div>
    );
};

export default Home;
