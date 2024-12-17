import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddLoan from '../abutton/Loan_btn';
import ServiceButton from '../abutton/adservicebtn';
import AddManager from '../abutton/Manager_btn';

import './aloanhead.css'

function VLHeader({ scrollToContact }) {
  const navigate = useNavigate();

  const logout = () => {
    const token=localStorage.getItem('token');
    if (token){
      localStorage.removeItem('token');
      navigate('/');
    }   
  }
    


  return (
    <header className="ALh1">
      <div className="ALl1">
        <img src="/images/mainl.png" alt="main" className="ALl2" />
      </div>
      <nav className="ALn1">
        <button className="ALn2" onClick={() => navigate('/adhome')}>Home</button>
        <AddLoan />
        <ServiceButton />
        <AddManager />

      </nav>

      <div className="ALa1">
        <button className="ALa2" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default VLHeader;
