import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ scrollToAbout, scrollToService, scrollToContact }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/images/mainl.png" alt="main" className="small_logo" />
      </div>
      
      {/* Hamburger Menu Button */}
      <button className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
        <button className="homb">Home</button>
        <button className="aboutb" onClick={scrollToAbout}>
          About
        </button>
        <button className="serb" onClick={scrollToService}>
          Services
        </button>

        <div className="careers">
          <button className="carr" onClick={() => navigate('/careers/teaching')}>
            Careers
          </button>
        </div>

        <button className="contb" onClick={scrollToContact}>
          Contact Us
        </button>
      </nav>
      <div className="auth-buttons">
        <button className="login-btn" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="signup-btn" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </header>
  );
}

export default Header; 