import React from 'react';
import './first.css'; // Ensure this file contains the styles for the hero section

const HeroSection = () => {
  return (
    <section className="uhome-hero-section">
      <div className="uhome-hero-image">
        <img src="/images/group.jpeg" alt="main" />
      </div>
      <div className="uhome-hero-content">
        <h1>DISCOVER THE PATH TO YOUR</h1>
        <h2>SUCCESS</h2>
        <p>
          Unlock the opportunities that shape your future. From exams to scholarships, we make it simple to find and seize the best educational paths for you. Explore tailored resources and achieve your goals.
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
