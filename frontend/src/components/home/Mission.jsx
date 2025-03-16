import React from 'react';
import './Mission.css';

function Mission() {
  return (
    <section className="mission-section">
      <div className="mission-content">
        <div className="mission-header">
          <img src="/images/mainl.png" alt="Mission Logo" className="mission-logo" />
          <h2>Turning Your Aspirations into Reality</h2>
        </div>
        <p>
          No lengthy applications. No endless searches. With Eduraa, find the right 
          scholarships, loans, and exams tailored to your profile. Get recommendations 
          and start your journey to success with just a few clicks.
        </p>
      </div>
      <div className="mission-image">
        <img src="/images/img3.jpg" alt="Another Image" />
      </div>
    </section>
  );
}

export default Mission; 