import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewMocktest.css'; // Optional CSS file for styling

const UMockEntranceExamList = () => {
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
    navigate(`/user/mocktest/${examId}`); // Update route as needed
  };

  return (
    <div className="userviewmocktest">
      <h2>Entrance Exams</h2>
      {error && <p className="userviewmocktest-error-message">{error}</p>}
      <div className="userviewmocktest-grid">
        {entranceExams.map((exam) => (
          <div key={exam._id} className="userviewmocktest-item">
            <h3>{exam.name}</h3>
            <p>{exam.examType}</p>
            <button 
              className="userviewmocktest-button" 
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

export default UMockEntranceExamList;
