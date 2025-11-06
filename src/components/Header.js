import React, { useState } from 'react';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import Login from './Login';
import Register from './Register';

const Header = ({ onLogin }) => {
    const [authForm, setAuthForm] = useState(null); // null, 'register', 'login'

    const handleLogin = () => {
        setAuthForm(null);
        onLogin(); // trigger re-render to show admin features
    };

    const handleRegister = () => {
        setAuthForm(null); // close form after registration
    };

    const toggleAuthForm = (formType) => {
        setAuthForm(authForm === formType ? null : formType);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthForm(null);
        onLogin(); // trigger re-render to hide admin features
    };

    const getUserInfo = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return { name: payload.name, role: payload.role };
        } catch {
            return null;
        }
    };

    const userInfo = getUserInfo();

    return (
        <header>
            <div className="hero">
                <h1>Mario Pinheiro - 30015420</h1>
                <p>Passionate Front-End Developer specializing in creating responsive and user-friendly web applications.</p>
            </div>
            <nav>
                <NavLink smooth to="/#about">About</NavLink>
                <NavLink smooth to="/#projects">Projects</NavLink>
                <NavLink smooth to="/#skills">Skills</NavLink>
                <NavLink smooth to="/#contact">Contact</NavLink>
                {userInfo ? (
                    <>
                        <span>Welcome, {userInfo.name}!</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => toggleAuthForm('register')} className="register-btn">
                            {authForm === 'register' ? 'Cancel Register' : 'Register'}
                        </button>
                        <button onClick={() => toggleAuthForm('login')} className="login-btn">
                            {authForm === 'login' ? 'Cancel Login' : 'Login'}
                        </button>
                    </>
                )}
            </nav>
            {authForm === 'login' && <Login onLogin={handleLogin} />}
            {authForm === 'register' && <Register onRegister={handleRegister} />}
        </header>
    );
};

export default Header;
