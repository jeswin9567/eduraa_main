import React, { useRef, useState } from "react";
import UVLHeader from "../../../components/user/vheads/ulhead";
import HeroSection from '../../../components/common/first'; 
import MarginC from "../../../components/common/margin";
import ULoanList from "../../../components/user/ULoanlist";
import Footer from "../../../components/common/footer"; 
import '../../../pages/admin/functionalities/ascholar.css';
import useAuth from "../../../../function/useAuth";

function Loan() {
  useAuth();

  const footerRef = useRef(null);
  const [filters, setFilters] = useState({
    bankName: [],
    loanType: [],
    fieldOfStudy: [],
    amount: 1000000,
    interestRate: 10,
  });

  const scrollToContact = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <UVLHeader scrollToContact={scrollToContact} />
        <HeroSection />
        <div className="scholar-container">
          <MarginC setFilters={setFilters} />
          <ULoanList filters={filters} />
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );
}

export default Loan;
