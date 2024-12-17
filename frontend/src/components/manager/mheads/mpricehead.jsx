import React from 'react';
import { useNavigate } from 'react-router-dom';
import ManProfileBtn from '../button/mprofile';
import MServiceButton from '../button/mservice';
import MockTestBtn from '../button/maddmocktest';
import PriceBtn from '../button/pricebtn';
import './mpricehead.css'; // Ensure this file contains the header-specific styles

function ManPriHeader({ scrollToFooter }) {
    const navigate = useNavigate();

    const logout = () => {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  
    return (
    <header className="uhome-header">
      <div className="uhome-logo">
        <img src="/images/mainl.png" alt="main" className="uhome-small_logo" />
      </div>
      <nav className="uhome-nav">
        <button className="uhome-homb" onClick={() => navigate('/mhome')}>Home</button>
        <MServiceButton />
        <MockTestBtn />
        <PriceBtn />
        <button className="uhome-contb" onClick={scrollToFooter}>Contact Us</button>
        <ManProfileBtn />
      </nav>

      <div className="uhome-auth-buttons">
        <button className="uhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default ManPriHeader;
