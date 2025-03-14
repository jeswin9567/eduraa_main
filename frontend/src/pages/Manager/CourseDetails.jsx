import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManHomHeader from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import { FaUsers, FaBook, FaCheckCircle, FaComments, FaEye, FaVideo } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import './CourseDetails.css';

function CourseDetails() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompletions: 0,
        averageCompletionRate: 0
    });
    const [selectedCourseFeedback, setSelectedCourseFeedback] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/course/active');
            setCourses(response.data);
            
            // Calculate statistics
            const totalCompletions = response.data.reduce((sum, course) => 
                sum + (course.completedBy?.length || 0), 0);
            
            const avgCompletionRate = (totalCompletions / response.data.length).toFixed(2);
            
            setStats({
                totalCourses: response.data.length,
                totalCompletions,
                averageCompletionRate: avgCompletionRate
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    };

    const fetchFeedbacks = async (courseId) => {
        setFeedbackLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/course/feedback/${courseId}`);
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        } finally {
            setFeedbackLoading(false);
        }
    };

    const handleFeedbackClick = (course) => {
        setSelectedCourseFeedback(course);
        fetchFeedbacks(course._id);
    };

    const FeedbackModal = () => {
        if (!selectedCourseFeedback) return null;

        return (
            <div className="coursedet-modal-overlay">
                <div className="coursedet-modal">
                    <div className="coursedet-modal-header">
                        <h2>Feedback for {selectedCourseFeedback.topic}</h2>
                        <button 
                            className="coursedet-modal-close"
                            onClick={() => setSelectedCourseFeedback(null)}
                        >
                            <IoMdClose />
                        </button>
                    </div>
                    <div className="coursedet-modal-content">
                        {feedbackLoading ? (
                            <div className="coursedet-feedback-loading">Loading feedbacks...</div>
                        ) : feedbacks.length > 0 ? (
                            <div className="coursedet-feedback-list">
                                {feedbacks.map((feedback, index) => (
                                    <div key={index} className="coursedet-feedback-item">
                                        <div className="coursedet-feedback-header">
                                            <span className="coursedet-feedback-email">
                                                {feedback.studentEmail}
                                            </span>
                                            <span className="coursedet-feedback-date">
                                                {new Date(feedback.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="coursedet-feedback-text">{feedback.feedback}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="coursedet-no-feedback">No feedback available for this course.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="coursedet-loading">Loading...</div>;
    }

    return (
        <div>
            <ManHomHeader />
            <div className="mhomevisible-container">
                <Managersidebrcom />
                <div className="coursedet-container">
                    <div className="coursedet-header">
                        <h1>Course Management</h1>
                    </div>

                    <div className="coursedet-stats-grid">
                        <div className="coursedet-stat-card">
                            <div className="coursedet-stat-icon-wrapper">
                                <FaBook />
                            </div>
                            <div className="coursedet-stat-info">
                                <p className="coursedet-stat-value">{stats.totalCourses}</p>
                                <h3>Active Courses</h3>
                            </div>
                        </div>
                        <div className="coursedet-stat-card">
                            <div className="coursedet-stat-icon-wrapper completion">
                                <FaCheckCircle />
                            </div>
                            <div className="coursedet-stat-info">
                                <p className="coursedet-stat-value">{stats.totalCompletions}</p>
                                <h3>Total Completions</h3>
                            </div>
                        </div>
                        <div className="coursedet-stat-card">
                            <div className="coursedet-stat-icon-wrapper average">
                                <FaUsers />
                            </div>
                            <div className="coursedet-stat-info">
                                <p className="coursedet-stat-value">{stats.averageCompletionRate}</p>
                                <h3>Avg. Completion Rate</h3>
                            </div>
                        </div>
                    </div>

                    <div className="coursedet-content">
                        <div className="coursedet-table-header">
                            <h2>Course List</h2>
                        </div>
                        <div className="coursedet-courses">
                            {courses.map((course, index) => (
                                <div key={index} className="coursedet-course-card">
                                    <div className="coursedet-course-info">
                                        <div className="coursedet-course-main">
                                            <h3>{course.topic}</h3>
                                            <span className="coursedet-subtopic">{course.subTopic}</span>
                                        </div>
                                        <div className="coursedet-course-details">
                                            <div className="coursedet-detail-item">
                                                <span className="coursedet-label">Teacher:</span>
                                                <span>{course.teacherName}</span>
                                            </div>
                                            <div className="coursedet-detail-item">
                                                <span className="coursedet-label">Subject:</span>
                                                <span>{course.teacherAssignedSub}</span>
                                            </div>
                                            <div className="coursedet-detail-item">
                                                <span className="coursedet-label">Upload Date:</span>
                                                <span>{formatDate(course.uploadedAt)}</span>
                                            </div>
                                            <div className="coursedet-detail-item">
                                                <span className="coursedet-label">Completions:</span>
                                                <span className="coursedet-completion-count">
                                                    {course.completedBy?.length || 0} students
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="coursedet-course-actions">
                                        <button 
                                            className="coursedet-action-btn notes"
                                            onClick={() => window.open(course.notes, '_blank')}
                                        >
                                            <FaEye /> Notes
                                        </button>
                                        <button 
                                            className="coursedet-action-btn video"
                                            onClick={() => window.open(course.video, '_blank')}
                                        >
                                            <FaVideo /> Video
                                        </button>
                                        <button 
                                            className="coursedet-action-btn feedback"
                                            onClick={() => handleFeedbackClick(course)}
                                        >
                                            <FaComments /> Feedback
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackModal />
        </div>
    );
}

export default CourseDetails; 