import React from 'react';
import { useNavigate } from 'react-router-dom';
import MAddln from '../button/maddlon';
import MServiceButton from '../button/mservice';

import './mloanhead.css'

function MVLHeader({ scrollToContact }) {
  const navigate = useNavigate();

  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }   
  }
    


  return (
    <header className="MLh1">
      <div className="MLl1">
        <img src="/images/mainl.png" alt="main" className="MLl2" />
      </div>
      <nav className="MLn1">
        <button className="MLn2" onClick={() => navigate('/mhome')}>Home</button>
        <MAddln />
      </nav>

      <div className="MLa1">
        <button className="MLa2" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default MVLHeader;
