import React, { useState, useEffect } from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherAssignedStudentsCount from "../../components/teacher/dashboard/viewstudbox";
import LiveClassesBox from "../../components/teacher/dashboard/liveClass";
import ClassCountBox from "../../components/teacher/dashboard/uploadedCourseBox";
import MockTestStatusBox from "../../components/teacher/dashboard/mocktestbox";
import TeacherCalendar from "../../components/teacher/dashboard/teacherCalendar";
import { FaUsers, FaChalkboardTeacher, FaBook, FaClipboardCheck, 
         FaCalendarCheck, FaClock } from 'react-icons/fa';
import './teacherdashboard.css';
import axios from 'axios';
import useAuth from "../../../function/useAuth";

const TeacherDash = () => {
    useAuth();
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        // Fetch today's schedule
        const fetchTodaySchedule = async () => {
            try {
                const teacherEmail = localStorage.getItem('userEmail');
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/liveclass/today-schedule/${teacherEmail}`
                );
                setTodaySchedule(response.data.classes);
            } catch (error) {
                console.error("Error fetching today's schedule:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodaySchedule();

        return () => {
            clearInterval(timer);
        };
    }, []);

    const upcomingClasses = [
        { time: "10:00 AM", subject: "Mathematics", grade: "Grade 10" },
        { time: "11:30 AM", subject: "Physics", grade: "Grade 12" },
        { time: "2:00 PM", subject: "Chemistry", grade: "Grade 11" }
    ];

    return (
        <div className="teacher-dashboard">
            <TeacherDashHead />
            <div className="teacherdashbod-container">
                <Teachersidebrcom />
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div className="header-left">
                            <h1>Teacher Dashboard</h1>
                            <p className="welcome-message">{greeting}, Teacher</p>
                        </div>
                        <div className="header-right">
                            <div className="live-time">
                                <FaClock className="clock-icon" />
                                {currentTime.toLocaleTimeString()}
                            </div>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card gradient-blue">
                            <div className="stat-wrapper">
                                <TeacherAssignedStudentsCount />
                            </div>
                        </div>

                        <div className="stat-card gradient-purple">
                            <div className="stat-wrapper">
                                <LiveClassesBox />
                            </div>
                        </div>

                        <div className="stat-card gradient-green">
                            <div className="stat-wrapper">
                                <ClassCountBox />
                            </div>
                        </div>

                        <div className="stat-card gradient-orange">
                            <div className="stat-wrapper">
                                <MockTestStatusBox />
                            </div>
                        </div>
                    </div>

                    <div className="quick-info-section">
                        <div className="upcoming-classes">
                            <h3><FaCalendarCheck /> Today's Schedule</h3>
                            <div className="class-list">
                                {loading ? (
                                    <div className="loading-message">Loading schedule...</div>
                                ) : todaySchedule.length > 0 ? (
                                    todaySchedule.map((cls, index) => (
                                        <div key={cls.id} className="class-item">
                                            <div className="time-badge">{cls.time}</div>
                                            <div className="class-details">
                                                <h4>{cls.subject}</h4>
                                                <p>{cls.status ? 'In Progress' : 'Scheduled'}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-classes-message">
                                        No classes scheduled for today
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="calendar-container">
                            <h3><FaCalendarCheck /> Calendar & Reminders</h3>
                            <TeacherCalendar />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDash;