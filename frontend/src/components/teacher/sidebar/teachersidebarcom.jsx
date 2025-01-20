import React from "react";
import './teachersidebarcom.css'
import { useNavigate } from "react-router-dom";

const Teachersidebrcom = () => {
    const navigate = useNavigate();
    return(
        <>
        <div className="teachersidebar">
            <div className="teachersidebarbtns">
            <button onClick={() => navigate('/teacherhome')}>Home</button>
            <button>Courses</button>
            <button>Mocktest</button>
            <button>Classes</button>
            <button>Students</button>
            <button>Announcements</button>
            </div>
        </div>
        
        </>
    );
}
export default Teachersidebrcom;