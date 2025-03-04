import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEntrace from './buttons/Entrance_btn';
import AddLoan from './buttons/Loan_btn';
import Addscholar from './buttons/Scholarship_btn,';

import './headd.css';

function Header({ scrollToContact }) {
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
        <button className="uhome-homb" onClick={() => navigate('/adhome')}>Home</button>
        < AddEntrace/>
        <AddLoan />
        <Addscholar/>
        <button className="uhome-contb" onClick={scrollToContact}>Contact Us</button>
      </nav>
      <div className="uhome-search-box">
        <input
          type="text"
          placeholder="Search..."
          className="uhome-search-input"
        />
        <button className="uhome-search-button">Search</button>
      </div>
      <div className="uhome-auth-buttons">
        <button className="uhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
