import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell
} from 'recharts';
import ManHomHeader from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import './NewRptgn.css';
import { FaChartLine, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { LineChart, Line } from 'recharts';

import useAuth from '../../../function/useAuth';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function NewRptgn() {

    useAuth();
    const [courseAnalytics, setCourseAnalytics] = useState(null);
    const [financialAnalytics, setFinancialAnalytics] = useState(null);
    const [teacherAnalytics, setTeacherAnalytics] = useState(null);
    const [userEngagement, setUserEngagement] = useState(null);
    const [performanceMetrics, setPerformanceMetrics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Add this sample data for the line chart
    const dailyActiveData = [
        { value: 150 },
        { value: 180 },
        { value: 200 },
        { value: 220 },
        { value: 190 },
        { value: 240 },
        { value: 280 },
    ];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setIsLoading(true);
                const [courseRes, financialRes, teacherRes, engagementRes, performanceRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/course-analytics`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/financial-analytics`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/teacher-analytics`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/user-engagement`),
                    axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/performance-metrics`)
                ]);

                setCourseAnalytics(courseRes.data);
                setFinancialAnalytics(financialRes.data);
                setTeacherAnalytics(teacherRes.data);
                setUserEngagement(engagementRes.data);
                setPerformanceMetrics(performanceRes.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                setError('Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="newrptgn-loading">
                <div className="newrptgn-loading-spinner">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="newrptgn-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div>
            <ManHomHeader />
            <div className="newrptgn-analytics-container">
                <Managersidebrcom />
                <div className="newrptgn-analytics-content">
                    <h1>Analytics Dashboard</h1>

                    {/* Course Analytics Section */}
                    <div className="newrptgn-analytics-section">
                        <h2>Course Analytics</h2>
                        {courseAnalytics && (
                            <div className="newrptgn-metrics-grid">
                                <div className="newrptgn-metric-card">
                                    <h3>Total Courses</h3>
                                    <p>{courseAnalytics.totalCourses}</p>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Average Rating</h3>
                                    <p>{courseAnalytics.courseStats.averageRating} ⭐</p>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Completion Rate</h3>
                                    <p>{courseAnalytics.courseStats.completionRate}%</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Financial Analytics Section */}
                    <div className="newrptgn-analytics-section">
                        <h2>Financial Analytics</h2>
                        {financialAnalytics && (
                            <>
                                <div className="newrptgn-chart-container">
                                    <BarChart width={500} height={300} data={[
                                        { name: 'Mock Test', value: financialAnalytics.revenueByPlan.mocktest },
                                        { name: 'Normal', value: financialAnalytics.revenueByPlan.normal },
                                        { name: 'Premium', value: financialAnalytics.revenueByPlan.premium }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Teacher Analytics Section */}
                    <div className="newrptgn-analytics-section">
                        <h2>Teacher Analytics</h2>
                        {teacherAnalytics && (
                            <div className="newrptgn-metrics-grid">
                                <div className="newrptgn-metric-card">
                                    <h3>Active Teachers</h3>
                                    <p>{teacherAnalytics.teacherStats.totalActive}</p>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Average Rating</h3>
                                    <p>{teacherAnalytics.teacherStats.averageRating.toFixed(1)} ⭐</p>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Total Courses</h3>
                                    <p>{teacherAnalytics.totalCourses}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Engagement Section */}
                    <div className="newrptgn-analytics-section">
                        <h2><FaUsers /> User Engagement</h2>
                        {userEngagement && (
                            <div className="newrptgn-metrics-grid">
                                <div className="newrptgn-metric-card">
                                    <h3>Active Students</h3>
                                    <p>{userEngagement.activeUsers}</p>
                                    <span className="metric-subtitle">Last 7 Days</span>
                                    <LineChart width={200} height={60} data={userEngagement.dailyActiveData}>
                                        <Line 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#8884d8" 
                                            strokeWidth={2} 
                                            dot={false} 
                                        />
                                    </LineChart>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Course Completion</h3>
                                    <p>{userEngagement.completionRate}%</p>
                                    <span className="metric-subtitle">Average Rate</span>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Premium Retention</h3>
                                    <p>{userEngagement.retentionRate}%</p>
                                    <span className="metric-subtitle">Subscription Renewal Rate</span>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Premium Users</h3>
                                    <p>{userEngagement.totalPremiumUsers}</p>
                                    <span className="metric-subtitle">Active Subscriptions</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Performance Metrics */}
                    <div className="newrptgn-analytics-section">
                        <h2><FaChartLine /> Performance Metrics</h2>
                        {performanceMetrics && (
                            <div className="newrptgn-metrics-grid">
                                <div className="newrptgn-metric-card">
                                    <h3>Top Performing Course</h3>
                                    <p>{performanceMetrics.topCourse.name}</p>
                                    <span className="metric-subtitle">
                                        {performanceMetrics.topCourse.completions} Completions
                                    </span>
                                    <span className="metric-subtitle">
                                        ⭐ {performanceMetrics.topCourse.rating} ({performanceMetrics.topCourse.totalFeedback} reviews)
                                    </span>
                                    <span className="metric-subtitle">
                                        By {performanceMetrics.topCourse.teacher}
                                    </span>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Most Active Teacher</h3>
                                    <p>{performanceMetrics.activeTeacher.name}</p>
                                    <span className="metric-subtitle">
                                        {performanceMetrics.activeTeacher.students} Active Students
                                    </span>
                                    <span className="metric-subtitle">
                                        {performanceMetrics.activeTeacher.subject}
                                    </span>
                                    <span className="metric-subtitle">
                                        {performanceMetrics.activeTeacher.totalActivities.courses} Courses | 
                                        {performanceMetrics.activeTeacher.totalActivities.mockTests} Mock Tests | 
                                        {performanceMetrics.activeTeacher.totalActivities.liveClasses} Live Classes
                                    </span>
                                </div>
                                <div className="newrptgn-metric-card">
                                    <h3>Popular Subject</h3>
                                    <p>{performanceMetrics.popularSubject.name}</p>
                                    <span className="metric-subtitle">
                                        {performanceMetrics.popularSubject.completions} Completions
                                    </span>
                                    <span className="metric-subtitle">
                                        {performanceMetrics.popularSubject.completionRate}% Success Rate
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewRptgn; 