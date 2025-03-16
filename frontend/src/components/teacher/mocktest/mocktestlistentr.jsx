import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './mocktestlistent.css'; // Optional CSS file for styling

const TeacherMockEntranceExamListCom = () => {
  const [entranceExams, setEntranceExams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const teacherEmail = localStorage.getItem('userEmail');

  // Fetch entrance exams from the backend
  useEffect(() => {
    const fetchEntranceExams = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/viewentr/teacher-assigned-entrances`,
          {
            headers: {
              email: teacherEmail
            }
          }
        );
        setEntranceExams(response.data);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching entrance exams';
        setError(errorMessage);
        console.error('Error fetching entrance exams:', error);
        setLoading(false);
      }
    };

    if (teacherEmail) {
      fetchEntranceExams();
    } else {
      setError('Teacher email not found. Please login again.');
      setLoading(false);
    }
  }, [teacherEmail]);

  // Handle navigation to the mock test creation page
  const handleMockTestClick = (examId) => {
    navigate(`/teacher/viewmocktest/${examId}`); // Update route as needed
  };

  if (loading) {
    return <div className="teachermocklists-loading">Loading...</div>;
  }

  return (
    <div className="teachermocklists">
      <h2>Your Assigned Entrance Exams</h2>
      {error && <p className="teachermocklists-error-message">{error}</p>}
      <div className="teachermocklists-grid">
        {entranceExams.length === 0 ? (
          <p className="teachermocklists-no-exams">
            No entrance exams assigned. Please contact the manager to assign exam types.
          </p>
        ) : (
          entranceExams.map((exam) => (
            <div key={exam._id} className="teachermocklists-item">
              <h3>{exam.name}</h3>
              <p>Education: {exam.education}</p>
              <p>Exam Type: {exam.examType}</p>
              <button 
                className="teachermocklists-test-button" 
                onClick={() => handleMockTestClick(exam._id)}
              >
                View Mock Tests
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherMockEntranceExamListCom;
