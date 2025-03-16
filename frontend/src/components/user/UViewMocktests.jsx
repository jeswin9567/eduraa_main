import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UViewMocktests.css';

const UMockTestList = () => {
  const { examId } = useParams();
  const [mockTests, setMockTests] = useState([]);
  const [error, setError] = useState('');
  const [participateCount, setParticipateCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchMockTests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/mocktest/viewmocktests/${examId}`);
        setMockTests(response.data);
      } catch (error) {
        setError('Error fetching mock tests');
        console.error('Error fetching mock tests:', error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/user/${userEmail}`);
        setParticipateCount(response.data.participate);
        setIsPremium(response.data.premium);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchMockTests();
    fetchUserDetails();
  }, [examId, userEmail]);

  const handleParticipate = (mockTestId) => {
    if (isPremium || participateCount < 3) {
      navigate(`/user/quiz/${mockTestId}`);
    } else {
      setShowPremiumPopup(true);
    }
  };

  return (
    <div className="uservmdets-list">
      <h2>Mock Tests for Entrance Exam</h2>
      {error && <p className="uservmdets-error-message">{error}</p>}
      {mockTests.length === 0 ? (
        <p className="uservmdets-no-tests">No mock tests available.</p>
      ) : (
        <div className="uservmdets-grid">
          {mockTests.map((mockTest) => (
            <div key={mockTest._id} className="uservmdets-item">
              <h3>{mockTest.title}</h3>
              <p>Duration: {mockTest.duration} minutes</p>
              <p>Total Marks: {mockTest.totalMarks}</p>
              <p>Questions: {mockTest.numberOfQuestions}</p>
              <p>Passing Marks: {mockTest.passingMarks}</p>
              
              <button 
                className="uservmdets-update-button" 
                onClick={() => handleParticipate(mockTest._id)}
              >
                Participate
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Premium Popup */}
      {showPremiumPopup && (
        <div className="premium-popup">
          <div className="premium-popup-content">
            <p>Just participate the test with Eduraa Premium to access unlimited tests!</p>
            <button onClick={() => setShowPremiumPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UMockTestList;
