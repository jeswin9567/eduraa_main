import React, { useRef } from 'react';
import './home.css';
import useAuth from '../../../function/useAuth';
import Header from '../../components/home/Header';
import Hero from '../../components/home/Hero';
import Mission from '../../components/home/Mission';
import AdditionalInfo from '../../components/home/AdditionalInfo';
import Services from '../../components/home/Services';
import About from '../../components/home/About';
import Footer from '../../components/home/Footer';

function HomePage() {
  useAuth();

  const AboutSectionRef = useRef(null);
  const ServiceSectionRef = useRef(null);
  const ContactSection = useRef(null);

  return (
    <div className="home-container">
      <Header 
        scrollToAbout={() => AboutSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        scrollToService={() => ServiceSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
        scrollToContact={() => ContactSection.current?.scrollIntoView({ behavior: 'smooth' })}
      />
      <Hero />
      <Mission />
      <AdditionalInfo />
      <Services ref={ServiceSectionRef} />
      <About ref={AboutSectionRef} />
      <Footer ref={ContactSection} />
    </div>
  );
}

export default HomePage;
