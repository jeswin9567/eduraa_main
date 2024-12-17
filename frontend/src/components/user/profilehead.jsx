import React from 'react';
import { useNavigate } from 'react-router-dom';
import UServiceButton from './button/uservice';
import './profilehead.css'
function UPHead({scrollToAbout,scrollToContact}) {
    const navigate = useNavigate();
    const logout = () => {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        navigate('/');
      }
    }

    return (
    <header className="userphead-header">
      <div className="userphead-logo">
        <img src="/images/mainl.png" alt="main" className="userphead-small_logo" />
      </div>
      <nav className="userphead-nav">
        <button className="userphead-homb" onClick={() => navigate('/userhome')}>Home</button>
        <UServiceButton />
        <button className='userphead-homb' onClick={scrollToAbout}>About</button>
        <button className='userphead-homb' onClick={scrollToContact}>Contact Us</button>
      </nav>
      <div className="userphead-auth-buttons">
        <button className="userphead-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default UPHead;
