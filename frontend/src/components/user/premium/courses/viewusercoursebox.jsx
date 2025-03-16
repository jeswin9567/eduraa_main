import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./viewusercoursebox.css";

const UVClassCom = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { subject } = useParams();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/student/course`);
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        const filteredData = data.filter((classItem) => classItem.teacherAssignedSub === subject);
        const groupedTopics = filteredData.reduce((acc, classItem) => {
          acc[classItem.topic] = (acc[classItem.topic] || 0) + 1;
          return acc;
        }, {});

        const topicArray = Object.entries(groupedTopics).map(([topic, count]) => ({
          topic,
          count,
        }));

        setTopics(topicArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [subject]);

  const getTopicIcon = (topic) => {
    const icons = {
      "Algebra": "🔢",
      "Geometry": "📐",
      "Calculus": "📊",
      "Mechanics": "⚙️",
      "Electricity": "⚡",
      "Optics": "🔭",
      "Organic": "🧪",
      "Inorganic": "⚗️",
      // Add more topic-specific icons
    };
    return icons[topic] || "📚";
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="userprmclasbox-container">
      <motion.div 
        className="course-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="userprmclasbox-title">
          <span className="subject-name">{subject}</span>
          <span className="title-separator">|</span>
          <span className="title-text">Course Topics</span>
        </h2>
        <p className="course-description">
          Explore comprehensive lessons and interactive content
        </p>
      </motion.div>

      {topics.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="empty-icon">📚</span>
          <h3>No Topics Available</h3>
          <p>Check back later for new content updates</p>
        </motion.div>
      ) : (
        <motion.div 
          className="userprmclasbox-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {topics.map((topicItem, index) => (
            <motion.div
              key={topicItem.topic}
              className="userprmclasbox-card"
              onClick={() => navigate(`/tsubtopics/${encodeURIComponent(topicItem.topic)}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
              }}
            >
              <div className="topic-icon">
                {getTopicIcon(topicItem.topic)}
              </div>
              <h3 className="userprmclasbox-topic">{topicItem.topic}</h3>
              <div className="topic-details">
                <div className="class-count">
                  <span className="count-number">{topicItem.count}</span>
                  <span className="count-text">Classes</span>
                </div>
                <div className="topic-action">
                  <span className="action-text">Start Learning</span>
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

export default UVClassCom;
