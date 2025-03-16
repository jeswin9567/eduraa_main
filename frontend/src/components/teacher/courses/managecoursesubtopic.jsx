import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./managecoursesubtopics.css";

const SubtopicsPageCom = () => {
  const { topic } = useParams();
  const [subtopics, setSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedClassFeedbacks, setSelectedClassFeedbacks] = useState([]);
  const [showViewedModal, setShowViewedModal] = useState(false);
  const [viewedStudents, setViewedStudents] = useState([]);

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
          `${import.meta.env.VITE_API_URL}/api/course/subtopics?email=${email}&topic=${encodeURIComponent(topic)}`
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

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/toggle-subtopic/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activeStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subtopic status");
      }

      setSubtopics((prevSubtopics) =>
        prevSubtopics.map((subtopic) =>
          subtopic._id === id ? { ...subtopic, activeStatus: newStatus } : subtopic
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVideoClick = (videoUrl) => {
    navigate("/video-player", { state: { videoUrl } }); // Navigate to VideoPlayerPage with the video URL as state
  };

  const handleViewFeedbacks = async (classId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/course/feedback/${classId}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }
      
      const data = await response.json();
      setSelectedClassFeedbacks(data);
      setShowFeedbackModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewedClick = async (classId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/course/viewed-students/${classId}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch viewed students");
      }
      
      const data = await response.json();
      setViewedStudents(data);
      setShowViewedModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  if (loading) return <div className="sublistcour-loading">Loading...</div>;
  if (error) return <div className="sublistcour-error">Error: {error}</div>;

  return (
    <div className="sublistcour-container">
      <h2 className="sublistcour-title">{topic}</h2>
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
                <button
                  onClick={() => handleVideoClick(subtopicItem.video)} // Navigate to video player page
                  className="sublistcour-link"
                >
                  Watch Video
                </button>
              </p>
              <p className="sublistcour-uploaded">
                Uploaded At: {new Date(subtopicItem.uploadedAt).toLocaleString()}
              </p>
              <p className="sublistcour-active-status">
                Status: {subtopicItem.activeStatus ? "Active" : "Not Active"}
              </p>
              <button
                className="sublistcour-disable-btn"
                onClick={() => handleToggleStatus(subtopicItem._id, subtopicItem.activeStatus)}
                disabled={subtopicItem.activeStatus === null}
              >
                {subtopicItem.activeStatus ? "Disable" : "Enable"}
              </button>
              <button
                className="sublistcour-update-btn"
                onClick={() => navigate(`/update-subtopic/${subtopicItem._id}`)}
              >
                Update
              </button>
              <button
                className="sublistcour-feedback-btn"
                onClick={() => handleViewFeedbacks(subtopicItem._id)}
              >
                View Feedbacks
              </button>
              <button
                className="sublistcour-viewed-btn"
                onClick={() => handleViewedClick(subtopicItem._id)}
              >
                Viewed
              </button>
              <button 
                className="sublistcour-back-btn"
                onClick={handleBack}
              >
                ← Back
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>Student Feedbacks</h3>
            <div className="feedback-list">
              {selectedClassFeedbacks.length > 0 ? (
                selectedClassFeedbacks.map((feedback, index) => (
                  <div key={index} className="feedback-item">
                    <p className="feedback-text">{feedback.feedback}</p>
                    <p className="feedback-date">
                      {new Date(feedback.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="no-feedback">No feedbacks yet</p>
              )}
            </div>
            <button 
              className="close-modal-btn"
              onClick={() => setShowFeedbackModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Viewed Students Modal */}
      {showViewedModal && (
        <div className="viewed-modal-overlay">
          <div className="viewed-modal">
            <h3>Students Who Viewed This Class</h3>
            <div className="viewed-list">
              {viewedStudents.length > 0 ? (
                <>
                  <div className="viewed-count">
                    Total Views: {viewedStudents.length}
                  </div>
                  <div className="viewed-students">
                    {viewedStudents.map((student, index) => (
                      <div key={index} className="viewed-student-item">
                        <p className="student-name">{student.name}</p>
                        <p className="viewed-date">
                          Viewed on: {new Date(student.completedAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="no-views">No students have viewed this class yet</p>
              )}
            </div>
            <button 
              className="close-modal-btn"
              onClick={() => setShowViewedModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtopicsPageCom;
