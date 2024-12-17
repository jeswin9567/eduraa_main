import React from 'react';
import { useNavigate } from 'react-router-dom';
import UServiceButton from '../button/uservice';
import Prof from '../button/profile';
import './mockhead.css';

function UMockHeader({ scrollToContact }) {
  const navigate = useNavigate();
  const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <header className="umockh-header">
      <div className="umockh-logo">
        <img src="/images/mainl.png" alt="main" className="umockh-small_logo" />
      </div>
      <nav className="umockh-nav">
        <button className="umockh-homb" onClick={() => navigate('/userhome')}>Home</button>
        <UServiceButton />
        <button className="umockh-contb" onClick={scrollToContact}>Contact Us</button>
        
        <Prof />
      </nav>
      <div className="umockh-search-box">
      </div>
      <div className="umockh-auth-buttons">
        <button className="umockh-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default UMockHeader;
