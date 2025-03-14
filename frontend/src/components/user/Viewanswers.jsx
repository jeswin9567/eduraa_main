import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './viewanswers.css';

const ViewStepsPage = () => {
  const { mockTestId } = useParams();
  const navigate = useNavigate();
  const [viewStepsData, setViewStepsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchViewStepsData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/viewans/quiz/viewSteps/${mockTestId}`, {
          params: { email: userEmail },
        });
        setViewStepsData(response.data);
      } catch (error) {
        console.error('Error fetching view steps data:', error);
        setErrorMessage('Failed to load steps. Please try again later.');
      }
    };

    fetchViewStepsData();
  }, [mockTestId, userEmail]);

  if (errorMessage) return (
    <motion.div 
      className="view-steps-error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {errorMessage}
    </motion.div>
  );

  return (
    <motion.div 
      className="view-steps-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="view-steps-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button 
          className="view-steps-back-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h2 className="view-steps-title">Detailed Solution Steps</h2>
        <p className="view-steps-subtitle">Review your answers and learn from the solutions</p>
      </motion.div>

      {viewStepsData.map((data, index) => (
        <motion.div 
          key={index} 
          className="view-steps-question"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="question-header">
            <span className="question-number">Question {index + 1}</span>
            <span className={`answer-status ${data.userAnswer === data.correctAnswer ? 'correct' : 'incorrect'}`}>
              {data.userAnswer === data.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
            </span>
          </div>

          <div className="question-content">
            <p className="question-text">{data.questionText}</p>
            
            <div className="answers-container">
              <div className="answer-box your-answer">
                <span className="answer-label">Your Answer</span>
                <p className="answer-text">{data.userAnswer}</p>
              </div>
              <div className="answer-box correct-answer">
                <span className="answer-label">Correct Answer</span>
                <p className="answer-text">{data.correctAnswer}</p>
              </div>
            </div>

            <div className="solution-steps">
              <h4 className="steps-title">Solution Steps</h4>
              <ul className="steps-list">
                {data.steps.map((step, stepIndex) => (
                  <motion.li 
                    key={stepIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stepIndex * 0.1 }}
                  >
                    {step}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ViewStepsPage;
