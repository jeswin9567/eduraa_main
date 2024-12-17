import React from 'react';
import { useNavigate } from 'react-router-dom';
import UServiceButton from '../button/uservice';
import USearchScholarship from '../button/search/uschosear';
import Prof from '../button/profile';
import '../header.css'

function UVSHeader({ scrollToContact }) {
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
       
        <USearchScholarship />
      </div>
      <div className="uhome-auth-buttons">
        <button className="uhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default UVSHeader;
