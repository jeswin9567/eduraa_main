import React, { forwardRef } from 'react';
import './Footer.css';

const Footer = forwardRef((props, ref) => {
  return (
    <footer className="footer" ref={ref}>
      <img src="./images/mainl.png" alt="Footer Logo" className="footer-logo" />
      <div className="footer-content">
        <h3>Contact Us</h3>
        <p>Email: eduraa_mart@gmail.com<br />Phone: +91 9567258931</p>
        <p>
          We're here to help you on your educational journey. Whether you have 
          questions about entrance exams, scholarships, or financial aid, our 
          team is ready to assist you.
        </p>
      </div>
    </footer>
  );
});

export default Footer; 