import React from 'react';
import { useNavigate } from 'react-router-dom';
import './managemanhead.css'; // Ensure this file contains the header-specific styles
import AddManager from './abutton/Manager_btn';
import ServiceButton from './abutton/adservicebtn';

function ManageManHeader({ scrollToAbout, scrollToContact }) {
  const navigate = useNavigate();
  const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <header className="mhhome-header">
      <div className="mhhome-logo">
        <img src="/images/mainl.png" alt="main" className="mhhome-small_logo" />
      </div>
      <nav className="mhhome-nav">
        <button className="mhhome-homb" onClick={() => navigate('/adhome')}>Home</button>
        <ServiceButton />
        <AddManager />
        <button className="mhhome-contb" onClick={scrollToContact}>Contact Us</button>
      </nav>
      <div className="mhhome-auth-buttons">
        <button className="mhhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default ManageManHeader;
