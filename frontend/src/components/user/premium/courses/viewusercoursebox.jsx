import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import navigation and params
import "./viewusercoursebox.css";

const UVClassCom = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { subject } = useParams(); // Get subject from URL

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/student/course");
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();

        // Filter only the classes that belong to the selected subject
        const filteredData = data.filter((classItem) => classItem.teacherAssignedSub === subject);

        // Group filtered classes by topic
        const groupedTopics = filteredData.reduce((acc, classItem) => {
          acc[classItem.topic] = (acc[classItem.topic] || 0) + 1;
          return acc;
        }, {});

        // Convert grouped topics into an array
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
  }, [subject]); // Fetch data whenever the subject changes

  if (loading) return <div className="userprmclasbox-loading">Loading...</div>;
  if (error) return <div className="userprmclasbox-error">Error: {error}</div>;

  return (
    <div className="userprmclasbox-container">
      <h2 className="userprmclasbox-title">Available Courses for {subject}</h2>
      {topics.length === 0 ? (
        <p className="userprmclasbox-empty">No topics found</p>
      ) : (
        <div className="userprmclasbox-grid">
          {topics.map((topicItem) => (
            <div
              className="userprmclasbox-card"
              key={topicItem.topic}
              onClick={() => navigate(`/tsubtopics/${encodeURIComponent(topicItem.topic)}`)}
            >
              <h3 className="userprmclasbox-topic">{topicItem.topic}</h3>
              <p className="userprmclasbox-count">Number of Classes: {topicItem.count}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UVClassCom;
