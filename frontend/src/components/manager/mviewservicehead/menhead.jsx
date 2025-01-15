import React from "react";
import MAddentr from '../button/maddent';
import MockTestBtn from '../button/maddmocktest';
import ManProfileBtn from "../button/mprofile";
import './menhead.css'
import { useNavigate } from "react-router-dom";

const MVEHeader = () => {
    const navigate = useNavigate();
    const logout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    return (
        <div className="mentranceviewheadd-container">
            <div className="mentranceviewheadd-logo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />

            </div>
            <div className="mentranceviewheadd-buttons">
            <MAddentr /> 
            <MockTestBtn />
                <button className="mentranceviewheadd-profilebtn"><ManProfileBtn/></button>
                <button className="mentranceviewheadd-logoutbtn" onClick={logout}>Log Out</button>
            </div>
        </div>
    );
};

export default MVEHeader;
