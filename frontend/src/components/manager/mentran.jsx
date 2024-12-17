import React, { useRef ,useState} from "react";
import MEHeader from "./mheads/mehead";
import HeroSection from "../common/first";
import MarginCEntr from "../common/marginen";
import MEntranceList from "./MEntrancelist";
import Footer from "../common/footer";
import './mentran.css';
import useAuth from "../../../function/useAuth";

function MEntrance() {
    useAuth();
    const footerRef = useRef(null);
    const [filters, setFilters] = useState({
        education: [],
        examType: [],
        state: [],
        degrees: [],
      });
    return (
        <>
            <div>
                <MEHeader />
                <HeroSection />
                <div className="mentrance-container">
                 <MarginCEntr  className = "mmargin-c" setFilters={setFilters}/>
                 <MEntranceList className="mentrance-list" filters={filters}/>
                </div>
                <Footer />
            </div>
        </>
    );
}

export default MEntrance