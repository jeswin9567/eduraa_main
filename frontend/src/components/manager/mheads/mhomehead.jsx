import React from 'react';
import { useNavigate } from 'react-router-dom';
import ManProfileBtn from '../button/mprofile';
import PriceBtn from '../button/pricebtn';
import FeedBackBtn from '../button/Feedback';
import './mhomehead.css'; // Ensure this file contains the header-specific styles

function ManHomHeader({ scrollToAbout, scrollToServices, scrollToContact }) {
    const navigate = useNavigate();

    const logout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            navigate('/');
        }
    }

    return (
        <header className="mhomehead-header">
            <div className="mhomehead-logo">
                <img src="/images/mainl.png" alt="main" className="mhomehead-small_logo" />
            </div>
            <nav className="mhomehead-nav">
                <button className="mhomehead-homb">Home</button>
                <button className="mhomehead-aboutb" onClick={scrollToAbout}>About</button>
                <button className="mhomehead-serb" onClick={scrollToServices}>Services</button>
                <PriceBtn />
                <FeedBackBtn />
                <button className="mhomehead-contb" onClick={scrollToContact}>Contact Us</button>
                <ManProfileBtn />
            </nav>
            <div className="mhomehead-auth-buttons">
                <button className="mhomehead-login-btn" onClick={logout}>Logout</button>
            </div>
        </header>
    );
}

export default ManHomHeader;
