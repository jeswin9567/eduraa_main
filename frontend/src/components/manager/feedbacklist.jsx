import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedbackList.css';

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get('http://localhost:5000/feed/vfeedback');
        setFeedbackList(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setError('Failed to load feedback');
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) return <div className="loading">Loading feedback...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="feedbacklist-container">
      <h2 className="feedbacklist-title">Feedback Submissions</h2>
      {feedbackList.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <ul className="feedbacklist-list">
          {feedbackList.map((feedback) => (
            <li key={feedback._id} className="feedbacklist-item">
              <h3>{feedback.mockTestName}</h3>
              <p><strong>By:</strong> {feedback.email}</p>
              <p><strong>Feedback:</strong> {feedback.feedback}</p>
              {/* <p><strong>Entrance Exam:</strong> {feedback.entranceExamName}</p> */}
              <p className="feedbacklist-date">
                <strong>Submitted on:</strong> {new Date(feedback.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList;
