import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddLoan from '../abutton/Loan_btn';
import ServiceButton from '../abutton/adservicebtn';
import AddManager from '../abutton/Manager_btn';

import './lhead.css';

function LHeader({ scrollToContact }) {
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
        <button className="LH-nav-home-btn" onClick={() => navigate('/adhome')}>Home</button>
        <AddLoan />
        <ServiceButton />
        <AddManager />
        <button className="LH-nav-contact-btn" onClick={scrollToContact}>Contact Us</button>
      </nav>
      <div className="LH-auth-container">
        <button className="LH-logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default LHeader;
