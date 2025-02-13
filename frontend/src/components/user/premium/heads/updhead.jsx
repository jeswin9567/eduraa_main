import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './updhead.css';

const UserPremDHead = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        if (userEmail) {
            axios.get(`http://localhost:5000/user/user-details?email=${userEmail}`)
                .then(response => {
                    setUserName(response.data.name);
                })
                .catch(error => {
                    console.error("Error fetching user details:", error);
                });
        }
    }, [userEmail]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail'); 
        navigate('/');
    };

    return (
        <div className="uprmdhead-container">
            <div className="uprmdheadlogo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />
            </div>
            <div className="uprmdhead-userinfo">
                {/* Circle User Avatar Created with CSS */}
                <div className="user-avatar" onClick={() => navigate('/uvpro')}>
                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <p className="user-name" onClick={() => navigate('/uvpro')}>
                    {userName || "User"}
                </p>
                <button className="uprmdheadlogbtn" onClick={logout}>Log Out</button>
            </div>
        </div>
    );
};

export default UserPremDHead;
