import React, { useRef, useState } from "react";
import MSHeader from "./mheads/mshead";
import HeroSection from "../common/first";
import MarginCScho from "../common/marginscho";
import ManScholarshipList from "./MScholarlist";
import Footer from "../common/footer";
import '../../pages/admin/functionalities/ascholar.css'
import useAuth from "../../../function/useAuth";

function Mscholar() {
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
        <MSHeader scrollToContact={() => footerRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        <HeroSection />
        <div className="scholar-container">
          <MarginCScho setFilters={setFilters}/>
          <ManScholarshipList filters={filters}/>
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );
}

export default Mscholar;
