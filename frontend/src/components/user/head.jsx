import React from 'react';
import { useNavigate } from 'react-router-dom';
import Prof from './button/profile';
import './head.css'


function UHead({ scrollToAbout, scrollToServices, scrollToContact }) {
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
        <button className="uhome-homb"onClick={() => navigate('/userhome')}>Home</button>
        <button className="uhome-aboutb" onClick={scrollToAbout}>About</button>
        <button id ="service" className="uhome-serb" onClick={scrollToServices}>Services</button>
        <button className="uhome-contb" onClick={scrollToContact}>Contact Us</button>
        
       
        

      </nav>
      <div className="uhome-profsession">
      <Prof />
      </div>

   
      <div className="uhome-auth-buttons">
      
      
        <button className="uhome-login-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default UHead;
