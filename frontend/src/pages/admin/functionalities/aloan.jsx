import React, { useRef, useState } from "react";
import LHeader from "../../../components/admin/heads/loanhead";
import HeroSection from "../../../components/common/first";
import MarginC from "../../../components/common/margin";
import Footer from "../../../components/common/footer";
import LoanList from "../../../components/admin/Loanlist";
import './aloan.css'
import useAuth from "../../../../function/useAuth";

function Aloan() {

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
        <LHeader scrollToContact={() => footerRef.current?.scrollIntoView({ behavior: 'smooth' })} />
        <HeroSection />
        <div className="loan-container">
          <MarginC setFilters={setFilters}/>
          <LoanList filters={filters}/>
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );    
}

export default Aloan;
