import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./courseboxteac.css";
import { motion } from "framer-motion";

const SubjectBoxom = () => {
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

  const subjectIcons = {
    "Mathematics": "📐",
    "Physics": "⚡",
    "Chemistry": "🧪",
    "Biology": "🧬",
    "Computer Science": "💻",
    "English": "📚",
    // Add more subjects and their icons as needed
  };

  return (
    <div className="classheaduserprm-container">
      <div className="course-header">
        <h2 className="classheaduserprm-title">Your Premium Courses</h2>
        <p className="course-subtitle">Explore your personalized learning journey</p>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your premium courses...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && subjects.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <p>No subjects have been assigned yet.</p>
          <p className="empty-subtitle">Check back later for updates!</p>
        </div>
      )}

      {!loading && !error && subjects.length > 0 && (
        <motion.div 
          className="classheaduserprm-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              className="classheaduserprm-card"
              onClick={() => navigate(`/available-courses/${encodeURIComponent(subject)}`)}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="subject-icon">
                {subjectIcons[subject] || "📚"}
              </div>
              <h3 className="classheaduserprm-topic">{subject}</h3>
              <div className="card-footer">
                <p className="classheaduserprm-count">Explore Course Content</p>
                <span className="arrow-icon">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SubjectBoxom;
