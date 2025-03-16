import React, { useState, useEffect } from "react";
import ManHomHeader from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import useAuth from "../../../function/useAuth";
import TeacherRequestBox from "../../components/manager/Teacher/Requestcomp";
import ActiveTeacherBox from "../../components/manager/Teacher/Teacherbox";
import UserBox from "../../components/manager/User/userbox";
import { FaChartLine, FaGraduationCap, FaCog, FaClipboardCheck, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import './mhome.css';
import { useNavigate } from 'react-router-dom';

function Mhome()
{
    useAuth();
    const [greeting, setGreeting] = useState('');
    const [dashboardStats, setDashboardStats] = useState({
        revenue: {
            total: 0,
            currentMonth: 0
        },
        activeCourses: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchDashboardStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/payment/dashboard-stats`);
                setDashboardStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        fetchDashboardStats();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return(
        <>
        <div>
            <ManHomHeader />
            <div className="mhomevisible-container">
                <Managersidebrcom />
                <div className="dashboard-content">
                    <div className="dashboard-header">
                        <div className="header-left">
                            <h1>Dashboard Overview</h1>
                            <p className="welcome-message">{greeting}, Admin</p>
                        </div>
                        <div className="header-right">
                            <div className="date-time">{new Date().toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <TeacherRequestBox />
                        </div>
                        <div className="dashboard-card">
                            <ActiveTeacherBox />
                        </div>
                        <div className="dashboard-card">
                            <UserBox />
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card clickable" onClick={() => navigate('/manager/revenue-details')}>
                            <FaChartLine className="stat-icon" />
                            <div className="stat-content">
                                <h3>Total Revenue</h3>
                                <p>{formatCurrency(dashboardStats.revenue.total)}</p>
                                <span className="stat-subtitle">Current Month: {formatCurrency(dashboardStats.revenue.currentMonth)}</span>
                            </div>
                        </div>
                        <div className="stat-card clickable" onClick={() => navigate('/manager/course-details')}>
                            <FaGraduationCap className="stat-icon" />
                            <div className="stat-content">
                                <h3>Active Courses</h3>
                                <p>{dashboardStats.activeCourses}</p>
                                <span className="stat-subtitle">Total Available Courses</span>
                            </div>
                        </div>
                    </div>

                    <div className="quick-actions-grid">
                        <div className="action-card" onClick={() => navigate('/manager/analytics')}>
                            <div className="action-icon">
                                <FaChartLine />
                            </div>
                            <h3>Reports & Analytics</h3>
                            <p>View detailed insights and reports</p>
                        </div>
                        <div className="action-card" onClick={() => navigate('/manager/vprice')}>
                            <div className="action-icon">
                                <FaMoneyBillWave />
                            </div>
                            <h3>Payment Management</h3>
                            <p>Monitor transactions and subscription plans</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Mhome;