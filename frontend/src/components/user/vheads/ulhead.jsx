import React from 'react';
import { useNavigate } from 'react-router-dom';
import UServiceButton from '../button/uservice';
import Prof from '../button/profile';
import USearchLoan from '../button/search/ulnsear';
import '../header.css';

function UVLHeader({ scrollToContact }) {
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
        <button className="uhome-homb" onClick={() => navigate('/userhome')}>Home</button>
        <UServiceButton />
        <button className="uhome-contb" onClick={scrollToContact}>Contact Us</button>
        <Prof />
      </nav>
      <div className="uhome-search-box">
      <USearchLoan /> 
      </div>
      <div className="uhome-auth-buttons">
        <button className="uhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default UVLHeader;
