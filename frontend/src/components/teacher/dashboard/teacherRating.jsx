import React, { useEffect, useState } from "react";
import axios from "axios";
import './teacherRating.css';

const TeacherRatingBox = () => {
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const fetchTeacherRating = async () => {
      try {
        const teacherEmail = localStorage.getItem("userEmail");
        
        if (!teacherEmail) {
          setError("Teacher email not found in local storage.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/viewteachers/teacher-rating/${teacherEmail}`
        );
        
        setRating(response.data.averageRating);
        setFeedbackCount(response.data.totalFeedbacks);
        setLoading(false);
      } catch (err) {
        setError("Could not fetch the rating.");
        setLoading(false);
      }
    };

    fetchTeacherRating();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="rating-box loading">Loading...</div>;
  }

  return (
    <div className="rating-box">
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <h3>Your Rating</h3>
          {rating ? (
            <>
              {renderStars(rating)}
              <p className="rating-value">{rating.toFixed(1)} / 5.0</p>
              
            </>
          ) : (
            <p className="no-rating">No ratings yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherRatingBox; 