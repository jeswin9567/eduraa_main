import React, { forwardRef } from 'react';
import './Services.css';

const Services = forwardRef((props, ref) => {
  return (
    <section className="services-section" ref={ref}>
      <div className="services-container">
        <h2>SERVICES</h2>
        <div className="services">
          <div className="service-card">
            <div className="service-content">
              <img src="./images/entrance.png" alt="Entrance Exams" />
              <h3>Entrance</h3>
              <p>
                Prepare confidently for your entrance exams with our comprehensive resources, 
                including detailed syllabi, mock tests, and crucial exam dates.
              </p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-content">
              <img src="./images/Scholarship images.png" alt="Scholarships" />
              <h3>Scholarships</h3>
              <p>
                Discover scholarships that match your academic achievements and goals, 
                with clear details on eligibility, application steps, and deadlines.
              </p>
            </div>
          </div>
          <div className="service-card">
            <div className="service-content">
              <img src="./images/Student Loan.png" alt="Student Loans" />
              <h3>Financial Aid</h3>
              <p>
                Explore a variety of student loan options with complete information 
                on interest rates, repayment terms, and necessary documents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Services; 