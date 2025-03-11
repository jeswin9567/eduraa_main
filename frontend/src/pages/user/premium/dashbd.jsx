import React, { useState, useEffect } from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import ViewAssignedTeacherCount from "../../../components/user/premium/viewteachercount";
import './dashbd.css'

const UserPrmDashBrd = () => {
    const [learningProgress, setLearningProgress] = useState(0);
    const [progressDetails, setProgressDetails] = useState({ total: 0, completed: 0 });
    
    useEffect(() => {
        const fetchLearningProgress = async () => {
            try {
                const email = localStorage.getItem('userEmail'); // or however you store the email
                if (!email) {
                    console.error('No email found in localStorage');
                    return;
                }

                const response = await fetch(`http://localhost:5000/user/learning-progress/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                setLearningProgress(data.progressPercentage);
                setProgressDetails({
                    total: data.totalMocktests,
                    completed: data.completedTests
                });
            } catch (error) {
                console.error('Error fetching learning progress:', error);
                setLearningProgress(0);
            }
        };

        fetchLearningProgress();
    }, []);

    return (
        <>
            <UserPremDHead/>
            <div className="userdashbbprm-containerrr">
                <Usersidebrcom />
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <h1>Welcome to Premium Dashboard</h1>
                        <p>Access exclusive features and enhanced learning experience</p>
                    </div>
                    
                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Learning Progress</h3>
                            <div className="stat-value">{learningProgress}%</div>
                            <p>Completed {progressDetails.completed} of {progressDetails.total} tests</p>
                        </div>
                        
                        <div className="stat-card">
                            <h3>Practice Sessions</h3>
                            <div className="stat-value">24</div>
                            <p>This month</p>
                        </div>
                        
                        <div className="stat-card">
                            <h3>Time Spent</h3>
                            <div className="stat-value">12.5h</div>
                            <p>Last 7 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default UserPrmDashBrd;