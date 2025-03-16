import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./premmocktest.css";

const PremViewMocktest = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/course/teachers/subjects`)
      .then((response) => {
        setSubjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching subjects");
        setLoading(false);
      });
  }, []);

  const getSubjectIcon = (subject) => {
    const icons = {
      "Mathematics": "📐",
      "Physics": "⚡",
      "Chemistry": "🧪",
      "Biology": "🧬",
      "Computer Science": "💻",
      "English": "📚",
      // Add more subject icons as needed
    };
    return icons[subject] || "📝";
  };

  if (loading) {
    return (
      <div className="prmmoccls-loading">
        <div className="prmmoccls-spinner"></div>
        <p>Loading mock tests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prmmoccls-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="prmmoccls-container">
      <motion.div 
        className="prmmoccls-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="prmmoccls-title">Mock Tests</h2>
        <p className="prmmoccls-subtitle">
          Practice with our comprehensive subject-wise mock tests
        </p>
      </motion.div>

      {subjects.length === 0 ? (
        <motion.div 
          className="prmmoccls-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="empty-icon">📋</span>
          <h3>No Mock Tests Available</h3>
          <p>Check back later for new mock tests</p>
        </motion.div>
      ) : (
        <motion.div 
          className="prmmoccls-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              className="prmmoccls-card"
              onClick={() => navigate(`/mocktest-list/${encodeURIComponent(subject)}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
              }}
            >
              <div className="subject-icon">
                {getSubjectIcon(subject)}
              </div>
              <h3 className="subject-title">{subject}</h3>
              <div className="card-content">
                <div className="test-info">
                  <span className="info-label">Available Tests</span>
                  <span className="info-dot">•</span>
                  <span className="info-value">Multiple Levels</span>
                </div>
                <div className="card-footer">
                  <span className="start-text">View Tests</span>
                  <span className="arrow-icon">→</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PremViewMocktest;
