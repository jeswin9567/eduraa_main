import React from "react";
import './managersidebarcom.css'
import MServiceButton from "../button/mservice";
import MTeacherButton from "../button/teachers";
import MPriceButton from "../button/pricebtn";
import UpdateFlBtn from "../button/updfieldbtn";
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
                <UpdateFlBtn />
                
                <button onClick={() => navigate('/manager/students')}>Students</button>
                <button onClick={() => navigate('/manager/makeannouncement')}>Announcements</button>

                <MPriceButton />
            </div>
        </div>
        </>
    );
}
export default Managersidebrcom;