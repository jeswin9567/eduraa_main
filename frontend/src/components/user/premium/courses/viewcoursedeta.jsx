import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./viewusercoursebox.css";

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
        console.log("Fetching subtopics for topic:", topic); // Debug log

        const response = await fetch(
          `http://localhost:5000/api/course/student/course/${encodeURIComponent(topic)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received subtopics data:", data); // Debug log

        if (Array.isArray(data)) {
          setSubtopics(data);
        } else {
          console.error("Received non-array data:", data);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Error fetching subtopics:", err);
        setError(err.message || "Failed to fetch subtopics");
      } finally {
        setLoading(false);
      }
    };

    if (topic) {
      fetchSubtopics();
    }
  }, [topic]);

  if (loading) {
    return (
      <div className="userprmclasbox-loading">
        <p>Loading subtopics for {topic}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userprmclasbox-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="userprmclasbox-container">
      <h2 className="userprmclasbox-title">Subtopics under {topic}</h2>
      {subtopics.length === 0 ? (
        <div className="userprmclasbox-empty">
          <p>No subtopics found for {topic}</p>
          <p>Please check back later for new content.</p>
        </div>
      ) : (
        <div className="userprmclasbox-grid">
          {subtopics.map((subTopic, index) => (
            <div
              className="userprmclasbox-card"
              key={`${subTopic}-${index}`}
              onClick={() => 
                navigate(`/classes/${encodeURIComponent(topic)}/${encodeURIComponent(subTopic)}`)
              }
            >
              <h3 className="userprmclasbox-topic">{subTopic}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSubtopicsListCom;
