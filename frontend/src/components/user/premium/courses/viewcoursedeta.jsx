import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./viewcoursedeta.css";

const UserSubtopicsListCom = () => {
  const { topic } = useParams();
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubtopics = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/course/student/course/${encodeURIComponent(topic)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setSubtopics(data);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch subtopics");
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      fetchSubtopics();
    }
  }, [topic]);

  const getSubtopicIcon = (subtopic) => {
    const icons = {
      "Introduction": "📝",
      "Basic Concepts": "💡",
      "Advanced Topics": "🎯",
      "Practice": "✍️",
      "Examples": "📚",
      "Problems": "🧩",
      "Quiz": "📋",
      "Summary": "📑",
      // Add more subtopic-specific icons
    };
    return icons[subtopic] || "📖";
  };

  if (loading) {
    return (
      <div className="corsetop-loading">
        <div className="corsetop-spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="corsetop-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="corsetop-container">
      <motion.div 
        className="corsetop-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="corsetop-title">
          <span className="topic-highlight">{topic}</span>
          <span className="title-detail">Course Content</span>
        </h2>
        <p className="corsetop-description">
          Master each concept with our structured learning path
        </p>
      </motion.div>

      {subtopics.length === 0 ? (
        <motion.div 
          className="corsetop-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="empty-icon">📚</span>
          <h3>No Content Available Yet</h3>
          <p>We're preparing amazing content for this topic. Check back soon!</p>
        </motion.div>
      ) : (
        <motion.div 
          className="corsetop-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {subtopics.map((subTopic, index) => (
            <motion.div
              key={`${subTopic}-${index}`}
              className="corsetop-card"
              onClick={() => 
                navigate(`/classes/${encodeURIComponent(topic)}/${encodeURIComponent(subTopic)}`)
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
              }}
            >
              <div className="subtopic-icon">
                {getSubtopicIcon(subTopic)}
              </div>
              <h3 className="subtopic-title">{subTopic}</h3>
              <div className="card-footer">
                <span className="start-learning">Start Learning</span>
                <span className="arrow-icon">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UserSubtopicsListCom;
