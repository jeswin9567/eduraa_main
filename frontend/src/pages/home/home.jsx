import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import useAuth from '../../../function/useAuth';

function HomePage() {
    useAuth();


    const navigate = useNavigate();

    const AboutSectionRef = useRef(null);

    const scrollToAbout = () =>{
      AboutSectionRef.current?.scrollIntoView({behavior:'smooth'});
    };

    const ServiceSectionRef = useRef(null)

    const ScrollToService =() =>{
      ServiceSectionRef.current?.scrollIntoView({behavior:'smooth'})
    }

    const ContactSection = useRef(null)

    const ScrollToContact = () =>{
      ContactSection.current?.scrollIntoView({behavior:'smooth'})
    }

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="/images/mainl.png" alt="main" className="small_logo" />
        </div>
        <nav className="nav">
          <button className="homb">Home</button>    
          <button className="aboutb" onClick={scrollToAbout}>About</button>
          <button className="serb" onClick={ScrollToService}>Services</button>
          <button className="contb" onClick={ScrollToContact}>Contact Us</button>
        </nav>
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate('/login')} >Login</button>
          <button className="signup-btn" onClick={ () => navigate('/signup')}>Sign Up</button>
        </div>
      </header>

<section className="hero-section">
  {/* Hero Image Section */}
  <div className="hero-image">
    <img src="/images/group.jpeg" alt="main" />
  </div>

  {/* Hero Content Section */}
  <div className="hero-content">
    <h1>DISCOVER THE PATH TO YOUR </h1>
    <h2>SUCCESS</h2>
    <p>
      Unlock the opportunities that shape your future. From exams to scholarships, we make it simple to find and seize the best educational paths for you. Explore tailored resources and achieve your goals.
    </p>
  </div>
</section>



<section className="mission-section">
  {/* Mission Content Section */}
  <div className="mission-content">
    <img src="/images/mainl.png" alt="Mission Logo" className="mission-logo" />
    <h2>Turning Your Aspirations into Reality</h2>
    <p>
      No lengthy applications. No endless searches. With Eduraa, find the right scholarships, loans, and exams tailored to your profile. Get recommendations and start your journey to success with just a few clicks.
    </p>
  </div>

  {/* Mission Image Section */}
  <div className="mission-image">
    <img src="/images/img3.jpg" alt="Another Image" />
  </div>
</section>

<section className="additional-info-section">
  <h4>Discover Your Path</h4>
  <h2>Your journey is personal. Just like your goals.</h2>
  <p>We provide all the information, resources, and tools in one place to make your academic journey as smooth as possible.</p>
</section>



      <section className="services-section" ref={ServiceSectionRef}>
        <h2>SERVICES</h2>
        <div className="services">
          <div className="service">
            <img src="./images/entrance.png" alt="Entrance Exams" />
            <h3>Entrance</h3>
            <p>
              Prepare confidently for your entrance exams with our comprehensive resources, including detailed syllabi, mock tests, and crucial exam dates.
            </p>
          </div>
          <div className="service">
            <img src="./images/Scholarship images.png" alt="Scholarships" />
            <h3>Scholarships</h3>
            <p>
              Discover scholarships that match your academic achievements and goals, with clear details on eligibility, application steps, and deadlines.
            </p>
          </div>
          <div className="service">
            <img src="./images/Student Loan.png" alt="Student Loans" />
            <h3>Financial Aid</h3>
            <p>
              Explore a variety of student loan options with complete information on interest rates, repayment terms, and necessary documents.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section" ref={AboutSectionRef}>
        <div className="about-content">
          <h2>ABOUT</h2>
          <p>
          Eduraa is your ultimate resource for navigating the world of education, offering students a one-stop platform for entrance exam preparation, scholarship discovery, and financial guidance. With comprehensive tools and information, we empower students to achieve their academic and financial goals with confidence. Whether you're looking for detailed exam resources, the perfect scholarship, or the right student loan, Eduraa is here to support you every step of the way.
          </p>
        </div>
        <div className="about-image">
          <img src="./images/teamstud.jpg" alt="About Us" />
        </div>
      </section>

      <footer className="footer" ref={ContactSection}>
        <img src="./images/mainl.png" alt="Footer Logo" className="footer-logo" />
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Email: eduraa_mart@gmail.com<br />Phone: +91 9567258931</p>
          <p>
            We’re here to help you on your educational journey. Whether you have questions about entrance exams, scholarships, or financial aid, our team is ready to assist you.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
