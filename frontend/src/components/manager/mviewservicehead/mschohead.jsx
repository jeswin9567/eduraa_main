import React from 'react';
import { useNavigate } from 'react-router-dom';
import MAddscholar from '../button/maddscho';
import MServiceButton from '../button/mservice';

import './mschohead.css'

function MVSHeader({ scrollToContact }) {
  const navigate = useNavigate();

  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }
  }
    


  return (
    <header className="MSh1">
      <div className="MSl1">
        <img src="/images/mainl.png" alt="main" className="MSl2" />
      </div>
      <nav className="MSn1">
        <button className="MSn2" onClick={() => navigate('/mhome')}>Home</button>
        <MAddscholar />
        <MServiceButton />
      </nav>

      <div className="MSa1">
        <button className="MSa2" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default MVSHeader;
