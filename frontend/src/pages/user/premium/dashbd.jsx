import React, { useState, useEffect } from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import './dashbd.css'
import useAuth from "../../../../function/useAuth";

const UserPrmDashBrd = () => {
    useAuth();
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
                const progressResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/learning-progress/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                // Fetch streak data
                const streakResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/learning-streak/${email}`, {
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

                const response = await fetch(`${import.meta.env.VITE_API_URL}/user/login-streak`, {
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

            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/update-activity`, {
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
            <div className="usrmp-userdashbbprm-containerrr">
                <Usersidebrcom />
                <div className="usrmp-dashboard-content">
                    <div className="usrmp-welcome-section">
                        <div className="usrmp-premium-badge">PREMIUM</div>
                        <h1>Welcome to Your Premium Experience</h1>
                        <p>Unlock your full potential with exclusive premium features</p>
                    </div>
                    
                    <div className="usrmp-stats-container">
                        <div className="usrmp-stat-card usrmp-progress-card">
                            <h3>Learning Progress</h3>
                            <div 
                                className="usrmp-progress-circle" 
                                style={{"--progress": `${learningProgress}%`}}
                            >
                                <div className="usrmp-progress-value">{learningProgress}%</div>
                            </div>
                            <p>Overall Completion</p>
                        </div>
                        
                        <div className="usrmp-stat-card">
                            <h3>Classes Progress</h3>
                            <div className="usrmp-stat-value">
                                {progressDetails.completedClasses}/{progressDetails.totalClasses}
                            </div>
                            <div className="usrmp-progress-bar">
                                <div 
                                    className="usrmp-progress-fill" 
                                    style={{width: `${(progressDetails.completedClasses/progressDetails.totalClasses) * 100}%`}}
                                ></div>
                            </div>
                            <p>Classes Completed</p>
                        </div>

                        <div className="usrmp-stat-card usrmp-feature-card">
                            <div className="usrmp-feature-icon">🔥</div>
                            <h3>Learning Streak</h3>
                            <div className="usrmp-stat-value">{streak.currentStreak} Days</div>
                            <p>Longest Streak: {streak.longestStreak} Days</p>
                            <div className="usrmp-streak-info">
                                <div className="usrmp-streak-tip">
                                    Complete daily activities to maintain your streak!
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="usrmp-premium-features">
                        <h2>Premium Benefits</h2>
                        <div className="usrmp-features-grid">
                            <div className="usrmp-feature-item">
                                <div className="usrmp-feature-icon">📚</div>
                                <h4>Exclusive Content</h4>
                                <p>Access premium learning materials</p>
                            </div>
                            <div className="usrmp-feature-item">
                                <div className="usrmp-feature-icon">👨‍🏫</div>
                                <h4>1-on-1 Sessions</h4>
                                <p>Direct interaction with teachers</p>
                            </div>
                            <div className="usrmp-feature-item">
                                <div className="usrmp-feature-icon">📊</div>
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