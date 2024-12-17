import React, { useRef, useState } from "react";
import UEVHeader from "../../../components/user/vheads/uehead";
import HeroSection from '../../../components/common/first'; // Ensure the import path is correct
import MarginCEntr from "../../../components/common/marginen";
import UEntranceList from "../../../components/user/UEntrancelist";
import Footer from "../../../components/common/footer"; // Ensure the import path is correct
import '../../../pages/admin/functionalities/ascholar.css'
import useAuth from "../../../../function/useAuth";

function Entrance() {

  useAuth();
  const footerRef = useRef(null);

  const [filters, setFilters] = useState({
    education: [],
    examType: [],
    state: [],
    degrees: [],
  });

  const scrollToContact = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div>
        <UEVHeader scrollToContact={scrollToContact} />
        <HeroSection />
        <div className="scholar-container">
          <MarginCEntr setFilters={setFilters}/>
          <UEntranceList filters= {filters} />
        </div>
        <Footer ref={footerRef} />
      </div>
    </>
  );
}

export default Entrance;
