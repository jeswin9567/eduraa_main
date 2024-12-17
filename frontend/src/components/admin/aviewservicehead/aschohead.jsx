import React from 'react';
import { useNavigate } from 'react-router-dom';
import Addscholar from '../abutton/Scholarship_btn';
import ServiceButton from '../abutton/adservicebtn';
import AddManager from '../abutton/Manager_btn';

import './aschohead.css'

function VSHeader({ scrollToContact }) {
  const navigate = useNavigate();

  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }
  }
    


  return (
    <header className="ASh1">
      <div className="ASl1">
        <img src="/images/mainl.png" alt="main" className="ASl2" />
      </div>
      <nav className="ASn1">
        <button className="ASn2" onClick={() => navigate('/adhome')}>Home</button>
        <Addscholar />
        <ServiceButton />
        <AddManager />
      </nav>

      <div className="ASa1">
        <button className="ASa2" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default VSHeader;
