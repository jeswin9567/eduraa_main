import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MockVEntr.css'; // Optional CSS file for styling

const MockEntranceExamList = () => {
  const [entranceExams, setEntranceExams] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch entrance exams from the backend
  useEffect(() => {
    const fetchEntranceExams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/viewentr'); // Adjust URL to your API endpoint
        setEntranceExams(response.data);
      } catch (error) {
        setError('Error fetching entrance exams');
        console.error('Error fetching entrance exams:', error);
      }
    };
    fetchEntranceExams();
  }, []);

  // Handle navigation to the mock test creation page
  const handleMockTestClick = (examId) => {
    navigate(`/manager/viewmocktest/${examId}`); // Update route as needed
  };

  return (
    <div className="mockentrlist">
      <h2>Entrance Exams</h2>
      {error && <p className="mockerror-message">{error}</p>}
      <div className="mockentrance-grid">
        {entranceExams.map((exam) => (
          <div key={exam._id} className="mockentrlist-item">
            <h3>{exam.name}</h3>
            <p>{exam.examType}</p>
            <button 
              className="mock-test-button" 
              onClick={() => handleMockTestClick(exam._id)}
            >
              Mock Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockEntranceExamList;
