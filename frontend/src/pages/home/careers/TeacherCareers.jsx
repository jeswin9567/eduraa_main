import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TeacherCareers.css';
import { FaClock, FaGlobeAmericas, FaChartLine, FaGraduationCap, FaLaptop, FaUsers, FaHome } from 'react-icons/fa';
import useAuth from '../../../../function/useAuth';

const TeacherCareers = () => {

    useAuth();

  useEffect(() => {
    // Smooth scroll function
    const smoothScroll = (e) => {
      if (e.target.hash) {
        e.preventDefault();
        const element = document.querySelector(e.target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', smoothScroll);
    });

    // Cleanup
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', smoothScroll);
      });
    };
  }, []);

  // Add scroll reveal animation
  useEffect(() => {
    const revealElements = document.querySelectorAll('.newrgag-benefit-card, .newrgag-step, .newrgag-stat');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1
    });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'all 0.6s ease-out';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="newrgag-teacher-careers">
      <Link to="/" className="newrgag-home-button">
        <FaHome /> Home
      </Link>

      <div className="newrgag-hero-section">
        <div className="newrgag-hero-content">
          <h1>Empower the Next Generation</h1>
          <p>Join Eduraa's elite community of educators and shape tomorrow's leaders</p>
          <Link to="/teacherregistration" className="newrgag-hero-button">
            Start Teaching Today
          </Link>
        </div>
      </div>

      <div className="newrgag-benefits-section">
        <h2>Why Teachers Choose Eduraa</h2>
        <div className="newrgag-benefits-grid">
          <div className="newrgag-benefit-card">
            <FaClock className="newrgag-benefit-icon" />
            <h3>Flexible Schedule</h3>
            <p>Design your teaching hours around your lifestyle</p>
          </div>
          <div className="newrgag-benefit-card">
            <FaGlobeAmericas className="newrgag-benefit-icon" />
            <h3>Global Reach</h3>
            <p>Connect with students worldwide from your home</p>
          </div>
          <div className="newrgag-benefit-card">
            <FaChartLine className="newrgag-benefit-icon" />
            <h3>Competitive Earnings</h3>
            <p>Earn up to ₹75,000/month teaching online</p>
          </div>
          <div className="newrgag-benefit-card">
            <FaGraduationCap className="newrgag-benefit-icon" />
            <h3>Growth & Development</h3>
            <p>Regular training and upskilling opportunities</p>
          </div>
          <div className="newrgag-benefit-card">
            <FaLaptop className="newrgag-benefit-icon" />
            <h3>Advanced Platform</h3>
            <p>State-of-the-art teaching tools and resources</p>
          </div>
          <div className="newrgag-benefit-card">
            <FaUsers className="newrgag-benefit-icon" />
            <h3>Supportive Community</h3>
            <p>Join a network of passionate educators</p>
          </div>
        </div>
      </div>

      <div className="newrgag-features-section">
        <div className="newrgag-feature-content">
          <h2>Transform Lives Through Education</h2>
          <p>Make a real difference while doing what you love</p>
          <ul className="newrgag-feature-list">
            <li>✓ Interactive virtual classrooms</li>
            <li>✓ Comprehensive teaching resources</li>
            <li>✓ Performance-based incentives</li>
            <li>✓ 24/7 technical support</li>
          </ul>
        </div>
        <div className="newrgag-feature-image"></div>
      </div>

      <div className="newrgag-process-section">
        <h2>Your Journey With Us</h2>
        <div className="newrgag-process-steps">
          <div className="newrgag-step">
            <div className="newrgag-step-number">1</div>
            <h3>Apply</h3>
            <p>Complete your profile and showcase your expertise</p>
          </div>
          <div className="newrgag-step">
            <div className="newrgag-step-number">2</div>
            <h3>Demo Class</h3>
            <p>Show your teaching style in a brief session</p>
          </div>
          <div className="newrgag-step">
            <div className="newrgag-step-number">3</div>
            <h3>Start Teaching</h3>
            <p>Begin your journey as an Eduraa educator</p>
          </div>
        </div>
      </div>

      <div className="newrgag-testimonial-section">
        <div className="newrgag-testimonial">
          <div className="newrgag-testimonial-image"></div>
          <p>"Joining Eduraa was the best career decision I've made. The flexibility and earning potential are unmatched."</p>
          <h4>Priya Sharma</h4>
          <span>Mathematics Teacher</span>
        </div>
      </div>

      <div className="newrgag-stats-section">
        <div className="newrgag-stat">
          <h2>1000+</h2>
          <p>Expert Teachers</p>
        </div>
        <div className="newrgag-stat">
          <h2>50,000+</h2>
          <p>Students Taught</p>
        </div>
        <div className="newrgag-stat">
          <h2>95%</h2>
          <p>Teacher Satisfaction</p>
        </div>
      </div>

      <div className="newrgag-cta-section">
        <h2>Ready to Transform Lives?</h2>
        <p>Join India's fastest-growing online education platform</p>
        <Link to="/teacherregistration" className="newrgag-cta-button">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default TeacherCareers; 