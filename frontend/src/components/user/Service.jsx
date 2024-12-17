// src/components/Uhome/ServicesSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Service.css'; // Ensure this file contains the services section-specific styles

const ServicesSec = React.forwardRef((props, ref) => {
  const navigate = useNavigate();

  return (
    <section className="uhome-services-section" ref={ref}>
      <h2>SERVICES</h2>
      <div className="uhome-services">
        <button className="uhome-service-btn" onClick={() => navigate('/entrance')}>
          <img src="./images/entrance.png" alt="Entrance Exams" />
          <h3>Entrance</h3>
          <p>
            Prepare confidently for your entrance exams with our comprehensive resources, including detailed syllabi, mock tests, and crucial exam dates.
          </p>
        </button>
        <button id="scholarship" className="uhome-service-btn" onClick={() => navigate('/scholarship')}>
          <img src="./images/Scholarship images.png" alt="Scholarships" />
          <h3>Scholarships</h3>
          <p>
            Discover scholarships that match your academic achievements and goals, with clear details on eligibility, application steps, and deadlines.
          </p>
        </button>
        <button className="uhome-service-btn" onClick={() => navigate('/loan')}>
          <img src="./images/Student Loan.png" alt="Student Loans" />
          <h3>Financial Aid</h3>
          <p>
            Explore a variety of student loan options with complete information on interest rates, repayment terms, and necessary documents.
          </p>
        </button>
      </div>
    </section>
  );
});

export default ServicesSec;
