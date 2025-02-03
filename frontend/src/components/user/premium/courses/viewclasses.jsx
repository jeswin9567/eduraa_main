import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewclasses.css"; // Premium UI styling

const UserClassDetail = () => {
  const { topic, subTopic } = useParams(); // Get topic and subtopic from URL
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/course/student/course/${topic}/${subTopic}`);
        if (!response.ok) {
          throw new Error("Failed to fetch class details");
        }
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [topic, subTopic]);

  if (loading) return <div className="classdetail-loading">Loading...</div>;
  if (error) return <div className="classdetail-error">Error: {error}</div>;

  return (
    <div className="classdetail-container">
      <h2 className="classdetail-title">{subTopic}</h2>
      {classes.length === 0 ? (
        <p className="classdetail-empty">No content available</p>
      ) : (
        classes.map((classItem) => (
          <div key={classItem._id} className="classdetail-box">
            {/* Video Player */}
            <div className="classdetail-video">
              <iframe 
                src={classItem.video} 
                title="Class Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>

            {/* Notes Section */}
            <div className="classdetail-content">
              <p className="classdetail-teacher">
                Uploaded by <span>{classItem.teacherName}</span>
              </p>
              <a 
                href={classItem.notes} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="classdetail-notes-btn"
              >
                View Notes (PDF)
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserClassDetail;
