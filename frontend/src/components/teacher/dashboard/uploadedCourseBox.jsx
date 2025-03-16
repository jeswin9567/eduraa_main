import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './uploadedCourseBox.css';

const ClassCountBox = () => {
    const [classCount, setClassCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const teacherEmail = localStorage.getItem('userEmail'); // Get the teacher's email from localStorage
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        const fetchTeacherClassCount = async () => {
            if (!teacherEmail) {
                console.error("Teacher email not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/classes/teacher-count?email=${teacherEmail}`);
                const data = await response.json();
                setClassCount(data.count);
            } catch (error) {
                console.error('Error fetching class count:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherClassCount();
    }, [teacherEmail]);

    if (loading) {
        return <div className="class-box loading">Loading...</div>;
    }

    // Handle button click to navigate to the manage courses page
    const handleButtonClick = () => {
        navigate('/teacher/managecourses');
    };

    return (
        <div className="class-box" onClick={handleButtonClick} style={{ cursor: 'pointer' }}>
            <h2>Your Uploaded Classes</h2>
            <span className="class-box__count">{classCount}</span>
        </div>
    );
};

export default ClassCountBox;
