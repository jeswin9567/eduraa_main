import React from 'react';
import { useNavigate } from 'react-router-dom';
import Prof from './button/profile';
import Swal from 'sweetalert2';
import './head.css';

function UHead({ scrollToAbout, scrollToServices, scrollToContact }) {
  const navigate = useNavigate();

  const premium = async () => {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to access premium features',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/users/${email}`);
      const userData = await response.json();

      if (userData.subscriptionPlan) {
        if (userData.subscriptionPlan === 'weekly') {
          Swal.fire({
            icon: 'info',
            title: 'Upgrade Required',
            text: 'You currently have a weekly plan. To access premium content, please upgrade to a monthly or yearly plan.',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Upgrade Now',
            cancelButtonText: 'Maybe Later'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/uvpro');
            }
          });
        } else {
          navigate('/user/premium');
        }
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Subscription Required',
          text: 'You don\'t have an active subscription plan. Subscribe to unlock premium features!',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Subscribe Now',
          cancelButtonText: 'Later'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/pricing');
          }
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
        confirmButtonColor: '#3085d6'
      });
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
        <button id = "premiumm" className="uhome-contb" onClick={premium}>Premium</button>
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
