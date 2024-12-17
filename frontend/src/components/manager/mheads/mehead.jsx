import React from 'react';
import { useNavigate } from 'react-router-dom';
import ManProfileBtn from '../button/mprofile';
import MAddentr from '../button/maddent';
import MServiceButton from '../button/mservice';
import MockTestBtn from '../button/maddmocktest';
import '../../common/head.css'; // Ensure this file contains the header-specific styles

function ManSerHeader({ scrollToAbout, scrollToServices, scrollToContact }) {
    const navigate = useNavigate();

    const logout = () => {
      const token=localStorage.getItem('token');
      if (token){
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
        <MAddentr />
        <MServiceButton />
        <button className="uhome-contb" onClick={scrollToContact}>Contact Us</button>
        <MockTestBtn />
        <ManProfileBtn />
      </nav>

      <div className="uhome-auth-buttons">
        <button className="uhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default ManSerHeader;
