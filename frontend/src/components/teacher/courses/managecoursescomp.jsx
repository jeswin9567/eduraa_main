import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "./managecoursescomp.css";

const VClassCom = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    const fetchClasses = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setError("User email not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/classes?email=${email}`);
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();

        const groupedTopics = data.reduce((acc, classItem) => {
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
  }, []);

  if (loading) return <div className="vclasscom-loading">Loading...</div>;
  if (error) return <div className="vclasscom-error">Error: {error}</div>;

  return (
    <div className="vclasscom-container">
      <h2 className="vclasscom-title">My Uploaded Classes</h2>
      {topics.length === 0 ? (
        <p className="vclasscom-empty">No topics found</p>
      ) : (
        <div className="vclasscom-grid">
          {topics.map((topicItem) => (
            <div
              className="vclasscom-card"
              key={topicItem.topic}
              onClick={() => navigate(`/subtopics/${topicItem.topic}`)} // Navigate to subtopics
            >
              <h3 className="vclasscom-topic">{topicItem.topic}</h3>
              <p className="vclasscom-count">Number of Classes: {topicItem.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VClassCom;
