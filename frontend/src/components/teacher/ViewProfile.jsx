import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './viewprofile.css';

const ViewTeachProf = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized access. Please log in.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/profile/teacher-profile", {
                    headers: { Authorization: token },
                });
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching teacher profile:", error);
                alert("Failed to load teacher profile. Please try again.");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherProfile();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No profile data available.</div>;
    }

    return (
        <div className="viewteacherprofcom">
            <div className="header-section">
                <img className="profile-photo" src={user.photo} alt="Teacher" />
                <h2>{user.firstname} {user.lastname}</h2>
                <p className="designation">{user.qualification} - {user.specialization}</p>
            </div>
            <div className="profile-info">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Alternate Phone:</strong> {user.altPhone}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>Subject:</strong> {user.subjects}</p>
                <p><strong>Date of Birth:</strong> {new Date(user.dateofbirth).toLocaleDateString()}</p>
                <p><strong>Experience:</strong> {user.experience} years</p>
                <p><strong>Subject Assigned:</strong> {user.subjectassigned || "None"}</p>
            </div>

            <div className="documents">
                <h3>Documents</h3>
                <p><strong>ID Card:</strong> <a href={user.idCard} target="_blank" rel="noreferrer">View</a></p>
                <p><strong>Degree Certificate:</strong> <a href={user.degreeCertificate} target="_blank" rel="noreferrer">View</a></p>
                <p><strong>Experience Certificate:</strong> <a href={user.experienceCertificate} target="_blank" rel="noreferrer">View</a></p>
                <p><strong>Resume:</strong> <a href={user.resume} target="_blank" rel="noreferrer">View</a></p>
            </div>
        </div>
    );
};

export default ViewTeachProf;
