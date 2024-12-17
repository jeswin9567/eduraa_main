import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddEntrace from './abutton/Entrance_btn';
import AddLoan from './abutton/Loan_btn';
import Addscholar from './abutton/Scholarship_btn';
import ServiceButton from './abutton/adservicebtn';

import './aheadd.css';

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
    <header className="h1">
      <div className="l1">
        <img src="/images/mainl.png" alt="main" className="l2" />
      </div>
      <nav className="n1">
        <button className="n2" onClick={() => navigate('/adhome')}>Home</button>
        <AddEntrace />
        <AddLoan />
        <Addscholar />
        <ServiceButton/>
        <button className="n3" onClick={scrollToContact}>Contact Us</button>
      </nav>

      <div className="a1">
        <button className="a2" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
