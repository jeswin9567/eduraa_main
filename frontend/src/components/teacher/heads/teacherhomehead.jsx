import React from "react";
import { useNavigate } from "react-router-dom";
import './teacherhomehead.css';

const TeacherDashHead = () => {
    const navigate =  useNavigate();
const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
        localStorage.removeItem('token');
        navigate('/');
    }
}

    return (
        <div className="teacherdashhead-container">
            <div className="teacherdashheadlogo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />
            </div>
            <div className="teacherdashhead-buttons">
                <button className="teacherheadprobtn">Profile</button>
                <button className="teacherheadlogbtn"onClick={logout}>Log Out</button>
            </div>
        </div>
    );
};

export default TeacherDashHead;
