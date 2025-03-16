import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManHomHeader from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import { FaUserGraduate, FaEnvelope, FaPhone, FaClock, FaGraduationCap, FaStar } from 'react-icons/fa';
import './StudentDetails.css';

const StudentDetails = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user/users');
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="student-loading">
                <div className="loading-spinner"></div>
                <p>Loading student details...</p>
            </div>
        );
    }

    return (
        <div>
            <ManHomHeader />
            <div className="sdpm-container">
                <Managersidebrcom />
                <div className="sdpm-content">
                    <div className="sdpm-header">
                        <FaUserGraduate className="sdpm-header-icon" />
                        <div className="sdpm-header-text">
                            <h2>Student Management</h2>
                            <p>View and manage student details</p>
                        </div>
                    </div>

                    <div className="sdpm-grid">
                        {students.map((student) => (
                            <div key={student._id} className="sdpm-card">
                                <div className="sdpm-card-header">
                                    <h3>{student.name}</h3>
                                    {student.premium && (
                                        <span className="sdpm-premium-badge">Premium</span>
                                    )}
                                </div>

                                <div className="sdpm-card-details">
                                    <div className="sdpm-detail-row">
                                        <FaEnvelope className="sdpm-detail-icon" />
                                        <span>{student.email}</span>
                                    </div>
                                    <div className="sdpm-detail-row">
                                        <FaPhone className="sdpm-detail-icon" />
                                        <span>{student.phone}</span>
                                    </div>
                                    <div className="sdpm-detail-row">
                                        <FaGraduationCap className="sdpm-detail-icon" />
                                        <span>Education: {student.education || 'Not specified'}</span>
                                    </div>
                                    {student.premium && (
                                        <>
                                            <div className="sdpm-detail-row">
                                                <FaClock className="sdpm-detail-icon" />
                                                <span>Plan: {student.subscriptionPlan}</span>
                                            </div>
                                            <div className="sdpm-detail-row">
                                                <FaStar className="sdpm-detail-icon" />
                                                <span>Expires: {new Date(student.premiumExpiresAt).toLocaleDateString()}</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="sdpm-stats">
                                    <div className="sdpm-stat-item">
                                        <strong>Participation</strong>
                                        <span>{student.participate}</span>
                                    </div>
                                    <div className="sdpm-stat-item">
                                        <strong>Current Streak</strong>
                                        <span>{student.currentStreak} days</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails; 