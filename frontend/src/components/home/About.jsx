import React, { forwardRef } from 'react';
import './About.css';

const About = forwardRef((props, ref) => {
  return (
    <section className="about-section" ref={ref}>
      <div className="about-content">
        <h2>ABOUT</h2>
        <p>
          Eduraa is your ultimate resource for navigating the world of education, 
          offering students a one-stop platform for entrance exam preparation, 
          scholarship discovery, and financial guidance. With comprehensive tools 
          and information, we empower students to achieve their academic and 
          financial goals with confidence. Whether you're looking for detailed 
          exam resources, the perfect scholarship, or the right student loan, 
          Eduraa is here to support you every step of the way.
        </p>
      </div>
      <div className="about-image">
        <img src="./images/teamstud.jpg" alt="About Us" />
      </div>
    </section>
  );
});

export default About; 