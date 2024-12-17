import React from 'react';
import { useNavigate } from 'react-router-dom';
import MAddscholar from '../button/maddscho';
import MServiceButton from '../button/mservice';
import ManProfileBtn from '../button/mprofile';

import '../../admin/heads/shead.css'

function MSHeader({ scrollToContact }) {
  const navigate = useNavigate();
  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  return (
    <header className="ScH-header">
      <div className="ScH-logo-container">
        <img src="/images/mainl.png" alt="main" className="ScH-logo-image" />
      </div>
      <nav className="ScH-nav-container">
        <button className="ScH-nav-home-btn" onClick={() => navigate('/mhome')}>Home</button>
        <MAddscholar />
        <MServiceButton />
        <button className="ScH-nav-contact-btn" onClick={scrollToContact}>Contact Us</button>
        <ManProfileBtn />
      </nav>

      <div className="ScH-auth-container">
        <button className="ScH-logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default MSHeader;
