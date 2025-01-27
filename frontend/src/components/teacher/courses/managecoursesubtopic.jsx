import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./managecoursesubtopics.css"; // Updated CSS file

const SubtopicsPageCom = () => {
  const { topic } = useParams(); // Get the topic from the URL
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubtopics = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        setError("User email not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/course/subtopics?email=${email}&topic=${encodeURIComponent(topic)}`
        );
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

  if (loading) return <div className="sublistcour-loading">Loading...</div>;
  if (error) return <div className="sublistcour-error">Error: {error}</div>;

  return (
    <div className="sublistcour-container">
      <h2 className="sublistcour-title">Subtopics for {topic}</h2>
      {subtopics.length === 0 ? (
        <p className="sublistcour-empty">No subtopics found</p>
      ) : (
        <ul className="sublistcour-grid">
          {subtopics.map((subtopicItem) => (
            <li key={subtopicItem._id} className="sublistcour-card">
              <h3 className="sublistcour-card-title">{subtopicItem.subTopic}</h3>
              <p>
                <a
                  href={subtopicItem.notes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sublistcour-link"
                >
                  View Notes
                </a>
              </p>
              <p>
                <a
                  href={subtopicItem.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sublistcour-link"
                >
                  Watch Video
                </a>
              </p>
              <p className="sublistcour-uploaded">
                Uploaded At: {new Date(subtopicItem.uploadedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubtopicsPageCom;
