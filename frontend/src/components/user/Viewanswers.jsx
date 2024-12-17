import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './viewanswers.css';

const ViewStepsPage = () => {
  const { mockTestId } = useParams();
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

  if (errorMessage) return <div className="loading">{errorMessage}</div>;

  return (
    <div className="view-steps-container">
      <h2 className="view-steps-title">Steps for Each Question</h2>
      {viewStepsData.map((data, index) => (
        <div key={index} className="view-steps-question">
          <h3>Question {index + 1}</h3>
          <p><strong>Question:</strong> {data.questionText}</p>
          <p><strong>Your Answer:</strong> {data.userAnswer}</p>
          <p><strong>Correct Answer:</strong> {data.correctAnswer}</p>
          <div className="view-steps-steps">
            <strong>Steps:</strong>
            <ul>
              {data.steps.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewStepsPage;
