import React, { useRef, useState } from "react";
import UVSHeader from "../../../components/user/vheads/shead";
import HeroSection from '../../../components/common/first'; // Ensure the import path is correct
import MarginCScho from "../../../components/common/marginscho";
import UScholarshipList from "../../../components/user/UScholarlist";
import Footer from "../../../components/common/footer"; // Ensure the import path is correct
import '../../../pages/admin/functionalities/ascholar.css';
import useAuth from "../../../../function/useAuth";

function Scholarship() {
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

  const scrollToContact = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <UVSHeader scrollToContact={scrollToContact} />
        <HeroSection />
        <div className="scholar-container">
          <MarginCScho setFilters={setFilters}/>
          <UScholarshipList filters={filters} />
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );
}

export default Scholarship;
