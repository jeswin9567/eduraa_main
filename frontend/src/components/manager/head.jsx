import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../common/head.css'; // Ensure this file contains the header-specific styles
import MAddentr from './button/maddent';
import MAddln from './button/maddlon';
import MAddscholar from './button/maddscho';

function Header({ scrollToAbout, scrollToServices, scrollToContact }) {
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
        <button className="uhome-homb"onClick={ () => navigate('/mhome')}>Home</button>
        <MAddentr />
        <MAddln />
        <MAddscholar />
        <button className="uhome-contb" onClick={scrollToContact}>Contact Us</button>
      </nav>
      <div className="uhome-auth-buttons">
        <button className="uhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
