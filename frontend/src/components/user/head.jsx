import React from 'react';
import { useNavigate } from 'react-router-dom';
import Prof from './button/profile';
import './head.css';

function UHead({ scrollToAbout, scrollToServices, scrollToContact }) {
  const navigate = useNavigate();

  // to check if the user has a subscription plan
  const premium = async () => {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      console.error("User is not logged in.");
      return;
    }

    try {
      // Make an API call to get user details from the server
      const response = await fetch(`http://localhost:5000/user/users/${email}`);
      const userData = await response.json();

      // Check if user has a valid subscription plan
      if (userData.subscriptionPlan) {
        if (userData.subscriptionPlan === 'weekly') {
          alert("You currently have a weekly plan. To access premium content, please upgrade to a monthly or yearly plan.");
        } else {
          // Navigate to the premium page if the subscription plan is not weekly
          navigate('/user/premium');
        }
      } else {
        alert("You don't have a subscription plan. Please subscribe to a plan.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <header className="uhome-header">
      <div className="uhome-logo">
        <img src="/images/mainl.png" alt="main" className="uhome-small_logo" />
      </div>
      <nav className="uhome-nav">
        <button className="uhome-homb" onClick={() => navigate('/userhome')}>Home</button>
        <button className="uhome-aboutb" onClick={scrollToAbout}>About</button>
        <button id="service" className="uhome-serb" onClick={scrollToServices}>Services</button>
        <button id = "premium" className="uhome-contb" onClick={premium}>Premium</button>
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
