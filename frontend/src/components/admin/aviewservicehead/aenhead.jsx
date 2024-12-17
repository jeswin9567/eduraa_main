import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEntrace from '../abutton/Entrance_btn';
import './aenhead.css';
import ServiceButton from '../abutton/adservicebtn';
import AddManager from '../abutton/Manager_btn';

function VEHeader({ scrollToContact }) {
  const navigate = useNavigate();
  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  return (
    <header className="VAEH-header">
      <div className="VAEH-logo-container">
        <img src="/images/mainl.png" alt="main" className="VAEH-logo-image" />
      </div>
      <nav className="VAEH-nav-container">
        <button className="VAEH-nav-home-btn" onClick={() => navigate('/adhome')}>Home</button>
        <AddEntrace />
        <ServiceButton />
        <AddManager />
      </nav>
      <div className="VAEH-auth-container">
        <button className="VAEH-logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default VEHeader;
