import React, { useEffect, useState } from 'react';
import './uploadedCourseBox.css';

const ClassCountBox = () => {
    const [classCount, setClassCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const teacherEmail = localStorage.getItem('userEmail'); // Get the teacher's email from localStorage

    useEffect(() => {
        const fetchTeacherClassCount = async () => {
            if (!teacherEmail) {
                console.error("Teacher email not found in localStorage");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/course/classes/teacher-count?email=${teacherEmail}`);
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

    return (
        <div className="class-box">
            <h2>Your Uploaded Classes</h2>
            <span className="class-box__count">{classCount}</span>
        </div>
    );
};

export default ClassCountBox;
