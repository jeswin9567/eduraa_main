import React from 'react';
import { useNavigate } from 'react-router-dom';
import MAddln from '../button/maddlon';
import ManProfileBtn from '../button/mprofile';
import MServiceButton from '../button/mservice';

import '../../admin/heads/lhead.css'

function MHeader({ scrollToContact }) {
  const navigate = useNavigate();
  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  return (
    <header className="LH-header">
      <div className="LH-logo-container">
        <img src="/images/mainl.png" alt="main" className="LH-logo-image" />
      </div>
      <nav className="LH-nav-container">
        <button className="LH-nav-home-btn" onClick={() => navigate('/mhome')}>Home</button>
        <MAddln />
        <MServiceButton />
        <button className="LH-nav-contact-btn" onClick={scrollToContact}>Contact Us</button>
        <ManProfileBtn />
      </nav>
      <div className="LH-auth-container">
        <button className="LH-logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default MHeader;
