import React from "react";
import './teacherhomehead.css';

const TeacherDashHead = () => {
    return (
        <div className="teacherdashhead-container">
            <div className="teacherdashheadlogo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />
            </div>
            <div className="teacherdashhead-buttons">
                <button className="teacherheadprobtn">Profile</button>
                <button className="teacherheadlogbtn">Log Out</button>
            </div>
        </div>
    );
};

export default TeacherDashHead;
