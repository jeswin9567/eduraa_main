// FeedbackModal.js
import React, { useState } from 'react';
import './Feedback.css';

const FeedbackModal = ({ isOpen, closeModal, onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    onSubmitFeedback(feedback);
    setFeedback(''); // Clear feedback after submission
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <h3>Submit Your Feedback</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          className="feedback-input"
        ></textarea>
        <button onClick={handleSubmit} className="submit-feedback-button">Submit</button>
        <button onClick={closeModal} className="close-feedback-button">Close</button>
      </div>
    </div>
  );
};

export default FeedbackModal;
