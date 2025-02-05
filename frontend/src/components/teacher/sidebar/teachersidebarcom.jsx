import React from "react";
import './teachersidebarcom.css'
import { useNavigate } from "react-router-dom";
import TeachMockButton from "../button/mocktest";
import TeachCousreButton from "../button/Classes";
import LiveClassBtn from "../button/liveclasses";

const Teachersidebrcom = () => {
    const navigate = useNavigate();
    return(
        <>
        <div className="teachersidebar">
            <div className="teachersidebarbtns">
            <button onClick={() => navigate('/teacherhome')}>Home</button>
            <LiveClassBtn />
            <TeachMockButton />
            <TeachCousreButton />
            <button onClick={ () => navigate('/teacher/assignedstudents')}>Students</button>
            <button>Announcements</button>
            </div>
        </div>
        
        </>
    );
}
export default Teachersidebrcom;