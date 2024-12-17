import React, { useRef, useState     } from "react";
import EHeader from "../../../components/admin/heads/entrancehead";
import HeroSection from "../../../components/common/first";
import MarginCEntr from "../../../components/common/marginen";
import EntranceList from "../../../components/admin/Entrancelist";
import Footer from "../../../components/common/footer";
import './aentrance.css'; // Import your CSS file
import useAuth from "../../../../function/useAuth";

function AEntrance() {
    useAuth();
    const footerRef = useRef(null); // Create a ref for the Footer
    const [filters, setFilters] = useState({
        education: [],
        examType: [],
        state: [],
        degrees: [],
      });
    
    return (
        <>
            <div>
                <EHeader scrollToContact={() => footerRef.current.scrollIntoView({ behavior: 'smooth' })} /> {/* Pass the scroll function */}
                <HeroSection />
                <div className="entrance-container"> {/* Updated class name */}
                    <MarginCEntr className="emargin-c"  setFilters={setFilters}/> {/* Updated class name */}
                    <EntranceList className="entrance-list" filters={filters} /> {/* Updated class name */}
                </div>
                <Footer ref={footerRef} /> {/* Attach the ref to Footer */}
            </div>
        </>
    );
}

export default AEntrance;
