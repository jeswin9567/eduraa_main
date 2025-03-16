import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-image">
        <img src="/images/group.jpeg" alt="main" />
      </div>
      <div className="hero-content">
        <h1>DISCOVER THE PATH TO YOUR </h1>
        <h2>SUCCESS</h2>
        <p>
          Unlock the opportunities that shape your future. From exams to scholarships, 
          we make it simple to find and seize the best educational paths for you. 
          Explore tailored resources and achieve your goals.
        </p>
      </div>
    </section>
  );
}

export default Hero; 