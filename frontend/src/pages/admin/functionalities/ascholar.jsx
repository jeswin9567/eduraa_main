import React, { useRef, useState } from "react";
import HeroSection from "../../../components/common/first";
import SHeader from "../../../components/admin/heads/scholarshiphead";
import MarginCScho from "../../../components/common/marginscho";
import Footer from "../../../components/common/footer";
import ScholarshipList from "../../../components/admin/Scholarlist";
import './ascholar.css'; // Import your CSS file
import useAuth from "../../../../function/useAuth";

function Ascholar() {

  useAuth();

  const footerRef = useRef(null);

  const [filters, setFilters] = useState({
    eligibility: [],
    subEligibility: {},
    gender: '',
    category: [],
    states: [],
    awardDuration: [],
    annualIncome: '',
    marks: ''
  });

  return (
    <>
      <div>
        <SHeader scrollToContact={() => footerRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        <HeroSection />
        <div className="scholar-container">
          <MarginCScho setFilters={setFilters}/>
          <ScholarshipList filters={filters}/>
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );
}

export default Ascholar;
