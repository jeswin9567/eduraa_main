// src/components/Uhome/MissionSection.jsx
import React from 'react';
import './Mission.css'; // Ensure this file contains the mission section-specific styles

function MissionSection() {
  return (
    <section className="uhome-mission-section">
      <div className="uhome-mission-content">
        <img src="/images/mainl.png" alt="Mission Logo" className="uhome-mission-logo" />
        <h2>Turning Your Aspirations into Reality</h2>
        <p>
          No lengthy applications. No endless searches. With Eduraa, find the right scholarships, loans, and exams tailored to your profile. Get recommendations and start your journey to success with just a few clicks.
        </p>
      </div>
      <div className="uhome-mission-image">
        <img src="/images/img3.jpg" alt="Another Image" />
      </div>
    </section>
  );
}

export default MissionSection;
