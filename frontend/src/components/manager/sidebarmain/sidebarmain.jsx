import React from "react";
import './managersidebarcom.css'
import MServiceButton from "../button/mservice";
import MTeacherButton from "../button/teachers";
import { useNavigate } from "react-router-dom";

const Managersidebrcom = () => {
    const navigate = useNavigate();
    return(
        <>
        <div className="managersidebar">
            <div className="managersidebarbtns">
            <button onClick={() =>navigate('/mhome')}>Home</button>
            <MServiceButton/>
            <MTeacherButton />
            <button>Agents</button>
            <button>Students</button>
            <button>Announcements</button>
            <button>Feedback</button>
            <button>Payment Option</button>
            </div>
        </div>
        
        </>
    );
}
export default Managersidebrcom;