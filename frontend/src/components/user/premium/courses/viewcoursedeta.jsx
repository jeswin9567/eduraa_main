import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./viewusercoursebox.css";

const UserSubtopicsListCom = () => {
  const { topic } = useParams(); // Get topic from URL
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubtopics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/course/student/course/${topic}`);
        if (!response.ok) {
          throw new Error("Failed to fetch subtopics");
        }
        const data = await response.json();
        setSubtopics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtopics();
  }, [topic]);

  if (loading) return <div className="userprmclasbox-loading">Loading...</div>;
  if (error) return <div className="userprmclasbox-error">Error: {error}</div>;

  return (
    <div className="userprmclasbox-container">
      <h2 className="userprmclasbox-title">Subtopics under {topic}</h2>
      {subtopics.length === 0 ? (
        <p className="userprmclasbox-empty">No subtopics found</p>
      ) : (
        <div className="userprmclasbox-grid">
          {subtopics.map((subTopic) => (
            <div
              className="userprmclasbox-card"
              key={subTopic}
              onClick={() => navigate(`/classes/${encodeURIComponent(topic)}/${encodeURIComponent(subTopic)}`)}
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
