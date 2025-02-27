import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../teacher/viewassignedstucom.css";  // Import the external CSS file

const StudentAssignedTeachersCom = () => {
  const [teacher, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchAssignedTeachers = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          setError("User email not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/viewassign/assigned-teachers?email=${userEmail}`
        );

        setTeachers(response.data.assignedTeacher);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Teachers.");
        setLoading(false);
      }
    };

    fetchAssignedTeachers();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await axios.post(
        `http://localhost:5000/api/viewassign/teacher-feedback/${selectedTeacherId}`,
        {
          studentEmail: userEmail,
          feedback,
          rating
        }
      );

      if (response.status === 200) {
        setShowFeedbackModal(false);
        setFeedback("");
        setRating(0);
        setSelectedTeacherId(null);
        alert("Feedback submitted successfully!");
      }
    } catch (err) {
      setError("Failed to submit feedback.");
    }
  };

  const renderStars = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="teacherviewstudnt">
      <h2>Assigned Teachers</h2>
      {loading ? (
        <div className="loading">Loading Teachers...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : teacher.length > 0 ? (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teacher.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.firstname}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.subjectassigned || "N/A"}</td>
                  <td>
                    <button
                      className="feedback-btn"
                      onClick={() => {
                        setSelectedTeacherId(teacher._id);
                        setShowFeedbackModal(true);
                      }}
                    >
                      Give Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-students">No assigned Teachers found.</div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>Submit Feedback</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="rating-container">
                <p>Rate your teacher:</p>
                {renderStars()}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback here..."
                required
              />
              <div className="feedback-modal-buttons">
                <button 
                  type="submit" 
                  disabled={!rating || !feedback.trim()}
                >
                  Submit
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedback("");
                    setRating(0);
                    setSelectedTeacherId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignedTeachersCom;
