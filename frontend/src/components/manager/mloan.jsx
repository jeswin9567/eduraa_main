import React, { useRef, useState } from "react";
import MHeader from "./mheads/mlhead";
import HeroSection from "../common/first";
import MarginC from "../common/margin";
import MLoanList from "./MLoanlist";
import Footer from "../common/footer";
import './mloan.css'
import useAuth from "../../../function/useAuth";

function Mloan() {

  useAuth();

  const footerRef = useRef(null);
  const [filters, setFilters] = useState({
    bankName: [],
    loanType: [],
    fieldOfStudy: [],
    amount: 1000000,
    interestRate: 10,
  });

  return (
    <>  
      <div>
        <MHeader scrollToContact={() => footerRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        <HeroSection />
        <div className="mloan-container">
          <MarginC setFilters={setFilters}/>
          <MLoanList filters={filters}/>
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );    
}

export default Mloan;
