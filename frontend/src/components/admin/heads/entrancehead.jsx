import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEntrace from '../abutton/Entrance_btn';
import ServiceButton from '../abutton/adservicebtn';
import AddManager from '../abutton/Manager_btn';
import './ehead.css';

function EHeader({ scrollToContact }) {
    const navigate = useNavigate();
    const logout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            navigate('/');
        }
    }

    return (
        <header className="EH-header">
            <div className="EH-logo-container">
                <img src="/images/mainl.png" alt="main" className="EH-logo-image" />
            </div>
            <nav className="EH-nav-container">
                <button className="EH-nav-home-btn" onClick={() => navigate('/adhome')}>Home</button>
                <AddEntrace />
                <ServiceButton />
                <AddManager />
                <button className="EH-nav-contact-btn" onClick={scrollToContact}>Contact Us</button> {/* Use the passed function */}
            </nav>
            <div className="EH-auth-container">
                <button className="EH-logout-btn" onClick={logout}>Logout</button>
            </div>
        </header>
    );
}

export default EHeader;
