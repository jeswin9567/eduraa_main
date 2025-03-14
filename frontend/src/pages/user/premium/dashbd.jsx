import React, { useState, useEffect } from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import ViewAssignedTeacherCount from "../../../components/user/premium/viewteachercount";
import './dashbd.css'

const UserPrmDashBrd = () => {
    const [learningProgress, setLearningProgress] = useState(0);
    const [progressDetails, setProgressDetails] = useState({
        totalClasses: 0,
        completedClasses: 0
    });
    const [streak, setStreak] = useState({
        currentStreak: 0,
        longestStreak: 0
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                if (!email) {
                    console.error('No email found in localStorage');
                    return;
                }

                // Fetch learning progress
                const progressResponse = await fetch(`http://localhost:5000/user/learning-progress/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                // Fetch streak data
                const streakResponse = await fetch(`http://localhost:5000/user/learning-streak/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!progressResponse.ok || !streakResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                
                const progressData = await progressResponse.json();
                const streakData = await streakResponse.json();
                
                setLearningProgress(progressData.progressPercentage);
                setProgressDetails({
                    totalClasses: progressData.totalClasses,
                    completedClasses: progressData.completedClasses
                });
                setStreak(streakData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const updateLoginStreak = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                if (!email) return;

                const response = await fetch('http://localhost:5000/user/login-streak', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    throw new Error('Failed to update login streak');
                }

                const data = await response.json();
                setStreak({
                    currentStreak: data.currentStreak,
                    longestStreak: data.longestStreak
                });
            } catch (error) {
                console.error('Error updating login streak:', error);
            }
        };

        updateLoginStreak();
    }, []);

    // Add this function to update activity
    const updateActivity = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) return;

            const response = await fetch('http://localhost:5000/user/update-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to update activity');
            }

            const data = await response.json();
            setStreak({
                currentStreak: data.currentStreak,
                longestStreak: data.longestStreak
            });
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    return (
        <>
            <UserPremDHead/>
            <div className="userdashbbprm-containerrr">
                <Usersidebrcom />
                <div className="dashboard-content">
                    <div className="welcome-section">
                        <div className="premium-badge">PREMIUM</div>
                        <h1>Welcome to Your Premium Experience</h1>
                        <p>Unlock your full potential with exclusive premium features</p>
                    </div>
                    
                    <div className="stats-container">
                        <div className="stat-card progress-card">
                            <h3>Learning Progress</h3>
                            <div className="progress-circle">
                                <div className="progress-value">{learningProgress}%</div>
                            </div>
                            <p>Overall Completion</p>
                        </div>
                        
                        <div className="stat-card">
                            <h3>Classes Progress</h3>
                            <div className="stat-value">
                                {progressDetails.completedClasses}/{progressDetails.totalClasses}
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{width: `${(progressDetails.completedClasses/progressDetails.totalClasses) * 100}%`}}
                                ></div>
                            </div>
                            <p>Classes Completed</p>
                        </div>

                        <div className="stat-card feature-card">
                            <div className="feature-icon">🔥</div>
                            <h3>Learning Streak</h3>
                            <div className="stat-value">{streak.currentStreak} Days</div>
                            <p>Longest Streak: {streak.longestStreak} Days</p>
                            <div className="streak-info">
                                <div className="streak-tip">
                                    Complete daily activities to maintain your streak!
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-features">
                        <h2>Premium Benefits</h2>
                        <div className="features-grid">
                            <div className="feature-item">
                                <div className="feature-icon">📚</div>
                                <h4>Exclusive Content</h4>
                                <p>Access premium learning materials</p>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">👨‍🏫</div>
                                <h4>1-on-1 Sessions</h4>
                                <p>Direct interaction with teachers</p>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">📊</div>
                                <h4>Detailed Analytics</h4>
                                <p>Track your progress in detail</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserPrmDashBrd;