import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MocktestList.css'; // Create this CSS file

const UserPrmMocktestList = () => {
  const [mocktests, setMocktests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participateCount, setParticipateCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const { subject } = useParams();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchMocktests = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) {
          setError('User email not found. Please login again.');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(
          `http://localhost:5000/api/mocktest/user-mocktests/${encodeURIComponent(subject)}`,
          {
            headers: {
              useremail: email
            }
          }
        );
        
        setMocktests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError(err.response?.data?.message || 'Failed to fetch mocktests');
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/user/${userEmail}`);
        setParticipateCount(response.data.participate);
        setIsPremium(response.data.premium);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchMocktests();
    fetchUserDetails();
  }, [subject, userEmail]);

  const handleParticipate = (mocktestId) => {
    if (isPremium || participateCount < 3) {
      localStorage.setItem('quizStartTime', Date.now().toString());
      navigate(`/user/quiz/${mocktestId}`);
    } else {
      setShowPremiumPopup(true);
    }
  };

  return (
    <div className="mocktest-container">
      <h2 className="mocktest-header">Mocktests for {decodeURIComponent(subject)}</h2>
      
      {loading && <div className="mocktest-loading">Loading...</div>}
      {error && <div className="mocktest-error">{error}</div>}
      
      {!loading && !error && (
        <div className="mocktest-grid">
          {mocktests.length === 0 ? (
            <p className="no-mocktests">No mocktests available for this subject</p>
          ) : (
            mocktests.map((mocktest) => (
              <div 
                key={mocktest._id} 
                className="mocktest-card"
              >
                <div className="mocktest-content">
                  <h3 className="mocktest-title">{mocktest.title}</h3>
                  <p className="mocktest-description">{mocktest.description}</p>
                  <div className="mocktest-info">
                    <div className="info-item">
                      <span className="info-label">Duration:</span>
                      <span className="info-value">{mocktest.duration} mins</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Marks:</span>
                      <span className="info-value">{mocktest.totalMarks}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Questions:</span>
                      <span className="info-value">{mocktest.numberOfQuestions}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Passing Marks:</span>
                      <span className="info-value">{mocktest.passingMarks}</span>
                    </div>
                  </div>
                  <button 
                    className="start-test-btn"
                    onClick={() => handleParticipate(mocktest._id)}
                  >
                    Participate
                  </button>
                </div>
              </div>
            ))
          )}
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

export default UserPrmMocktestList; 