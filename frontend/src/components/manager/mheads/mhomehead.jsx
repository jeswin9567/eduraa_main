import React from "react";
import './mhomehead.css';
import { useNavigate } from "react-router-dom";
import ManProfileBtn from "../button/mprofile";

const ManagerDashHead = () => {
    const navigate = useNavigate();
    const logout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            navigate('/');
        }
    }
    return (
        
        <div className="managerdashhead-container">
            <div className="managerdashheadlogo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />
            </div>
            <div className="managerdashhead-buttons">
                <button className="managerheadprobtn"><ManProfileBtn /></button>
                <button className="managerheadlogbtn" onClick={logout}>Log Out</button>
            </div>
        </div>
    );
};

export default ManagerDashHead;
