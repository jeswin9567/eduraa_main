import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './teacherhomehead.css';

const TeacherDashHead = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/profile/teacher-profile", {
                    headers: { Authorization: token },
                });
                setFirstName(response.data.firstname);
            } catch (error) {
                console.error("Error fetching teacher profile:", error);
            }
        };

        fetchTeacherProfile();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="teacherdashhead-container">
            <div className="teacherdashheadlogo">
                <img src="/images/Main logo.png" alt="Eduraa Logo" />
            </div>
            <div className="teacherdashhead-buttons">
                <button className="teacherheadprobtn" onClick={() => navigate("/teacher/profile")}>
                    {firstName || "Profile"}
                </button>
                <button className="teacherheadlogbtn" onClick={logout}>Log Out</button>
            </div>
        </div>
    );
};

export default TeacherDashHead;
