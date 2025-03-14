import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const [participationStatus, setParticipationStatus] = useState({});

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

    const checkParticipationStatus = async (mocktests) => {
      const statusMap = {};
      for (const mocktest of mocktests) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/mocktest/check-participation/${mocktest._id}`,
            {
              headers: { useremail: userEmail }
            }
          );
          statusMap[mocktest._id] = response.data;
        } catch (error) {
          console.error('Error checking participation status:', error);
        }
      }
      setParticipationStatus(statusMap);
    };

    const fetchData = async () => {
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
            headers: { useremail: email }
          }
        );
        
        setMocktests(response.data);
        await checkParticipationStatus(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err.response || err);
        setError(err.response?.data?.message || 'Failed to fetch mocktests');
        setLoading(false);
      }
    };

    fetchData();
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

  const handleViewResult = (mocktestId) => {
    navigate(`/user/quiz/${mocktestId}`);
  };

  return (
    <div className="mocktest-container">
      <motion.div 
        className="mocktest-header-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mocktest-header">
          <span className="subject-name">{decodeURIComponent(subject)}</span>
          <span className="header-separator">|</span>
          <span className="header-subtitle">Mock Tests</span>
        </h2>
        <p className="header-description">
          Challenge yourself with our curated mock tests
        </p>
      </motion.div>
      
      {loading && (
        <div className="mocktest-loading">
          <div className="loading-spinner"></div>
          <p>Loading mock tests...</p>
        </div>
      )}

      {error && (
        <motion.div 
          className="mocktest-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </motion.div>
      )}
      
      {!loading && !error && (
        <motion.div 
          className="mocktest-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {mocktests.length === 0 ? (
            <motion.div 
              className="no-mocktests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="empty-icon">📝</span>
              <h3>No Mock Tests Available</h3>
              <p>Check back later for new tests in this subject</p>
            </motion.div>
          ) : (
            mocktests.map((mocktest, index) => (
              <motion.div 
                key={mocktest._id} 
                className="mocktest-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                }}
              >
                <div className="mocktest-content">
                  <div className="test-header">
                    <div className="test-icon">📋</div>
                    <h3 className="mocktest-title">{mocktest.title}</h3>
                  </div>
                  <p className="mocktest-description">{mocktest.description}</p>
                  
                  <div className="mocktest-info">
                    <div className="info-item">
                      <span className="info-icon">⏱️</span>
                      <div className="info-details">
                        <span className="info-label">Duration</span>
                        <span className="info-value">{mocktest.duration} mins</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🎯</span>
                      <div className="info-details">
                        <span className="info-label">Total Marks</span>
                        <span className="info-value">{mocktest.totalMarks}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">❓</span>
                      <div className="info-details">
                        <span className="info-label">Questions</span>
                        <span className="info-value">{mocktest.numberOfQuestions}</span>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">✅</span>
                      <div className="info-details">
                        <span className="info-label">Passing Marks</span>
                        <span className="info-value">{mocktest.passingMarks}</span>
                      </div>
                    </div>
                  </div>

                  {participationStatus[mocktest._id]?.hasParticipated ? (
                    <button 
                      className="view-result-btn"
                      onClick={() => handleViewResult(mocktest._id)}
                    >
                      View Result <span className="btn-icon">📊</span>
                    </button>
                  ) : (
                    <button 
                      className="start-test-btn"
                      onClick={() => handleParticipate(mocktest._id)}
                    >
                      Start Test <span className="btn-icon">→</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {showPremiumPopup && (
        <motion.div 
          className="premium-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="premium-popup-content"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            <span className="premium-icon">⭐</span>
            <h3>Upgrade to Premium</h3>
            <p>Get unlimited access to all mock tests and boost your preparation!</p>
            <div className="popup-buttons">
              <button className="upgrade-btn">Upgrade Now</button>
              <button 
                className="close-btn"
                onClick={() => setShowPremiumPopup(false)}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default UserPrmMocktestList; 