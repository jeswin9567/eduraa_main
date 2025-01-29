import React from "react";
import { useNavigate } from "react-router-dom";
import './updhead.css';

const UserPremDHead = () => {
    const navigate =  useNavigate();
const logout = () => {
    const token = localStorage.getItem('token');
    if (token) {
        localStorage.removeItem('token');
        navigate('/');
    }
}

    return (
        <div className="uprmdhead-container">
            <div className="uprmdheadlogo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />
            </div>
            <div className="uprmdhead-buttons">
                <button className="uprmdheadprobtn" onClick={ () => navigate('/teacher/profile')}>Profile</button>
                <button className="uprmdheadlogbtn"onClick={logout}>Log Out</button>
            </div>
        </div>
    );
};

export default UserPremDHead;
