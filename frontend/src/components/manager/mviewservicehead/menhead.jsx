import React from 'react';
import { useNavigate } from 'react-router-dom';
import MAddentr from '../button/maddent';
import MServiceButton from '../button/mservice';
import MockTestBtn from '../button/maddmocktest';
import './menhead.css';

function MVEHeader({ scrollToContact }) {
  const navigate = useNavigate();
  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  return (
    <header className="VMEH-header">
      <div className="VMEH-logo-container">
        <img src="/images/mainl.png" alt="main" className="VMEH-logo-image" />
      </div>
      <nav className="VMEH-nav-container">
        <button className="VMEH-nav-home-btn" onClick={() => navigate('/mhome')}>Home</button>
        <MAddentr />
        <MServiceButton />
        <MockTestBtn />
      </nav>
      <div className="VMEH-auth-container">
        <button className="VMEH-logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default MVEHeader;
