import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './viewmocktestdetails.css'; // Optional CSS file for styling

const TeachViewMockTestDetails = () => {
  const { mockTestId } = useParams(); // Get the mock test ID from the URL
  const [mockTest, setMockTest] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch mock test details by ID
  useEffect(() => {
    const fetchMockTestDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/mocktest/mocktest/${mockTestId}`); // Adjust URL to your API endpoint
        setMockTest(response.data);
      } catch (error) {
        setError('Error fetching mock test details');
        console.error('Error fetching mock test details:', error);
      }
    };
    fetchMockTestDetails();
  }, [mockTestId]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleUpdate = () => {
    navigate(`/teacher/updatemocktest/${mockTestId}`); // Navigate to the update page
  };

  const handleDelete = async () => {
    try {
      // Call the backend to deactivate the mock test
      await axios.delete(`${import.meta.env.VITE_API_URL}/mocktest/mockTest/deactivate/${mockTestId}`); // Adjust URL to your API endpoint
  
      // Navigate to the mock tests list page after deactivation
      navigate(`/manager/managemocktest`); // Change to the correct path for your mock tests list
    } catch (error) {
      setError('Error deactivating mock test');
      console.error('Error deactivating mock test:', error);
    }
  };
  

  if (error) {
    return <div className="teachviewmocktestdetails-error">{error}</div>;
  }

  if (!mockTest) {
    return <div className="teachviewmocktestdetails-loading">Loading...</div>;
  }

  return (
    <div className="teachviewmocktestdetails-details">
      <h2>{mockTest.title}</h2>
      <p>Duration: {mockTest.duration} minutes</p>
      <p>Total Marks: {mockTest.totalMarks}</p>
      <p>Number of Questions: {mockTest.numberOfQuestions}</p>
      <p>Passing Marks: {mockTest.passingMarks}</p>

      <h3>Questions:</h3>
      <ul>
        {mockTest.questions.map((question, index) => (
          <li key={index}>
            <h4>Question {index + 1}: {question.questionText}</h4>
            {question.questionImage && (
              <div className="teachviewmocktestdetails-question-image">
                <img 
                  src={question.questionImage} 
                  alt={`Question ${index + 1}`}
                  style={{ maxWidth: '300px', margin: '10px 0' }}
                />
              </div>
            )}
            <p>Marks: {question.marks}</p>
            <p>Steps to Solve:</p>
            <ul>
              {question.steps.map((step, stepIndex) => (
                <li key={stepIndex}>{step}</li>
              ))}
            </ul>
            <p>Options:</p>
            <ul>
              {question.options.map((option, optionIndex) => (
                <li key={optionIndex}>
                  {option.optionText} {option.isCorrect ? '(Correct)' : ''}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {/* Buttons for Back, Update, and Delete */}
      <div className="teachviewmocktestdetails-buttons">
        <button className="teachviewmocktestdetails-back-button" onClick={handleBack}>Back</button>
        <button className="teachviewmocktestdetails-update-button" onClick={handleUpdate}>Update</button>
        <button className="teachviewmocktestdetails-delete-button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default TeachViewMockTestDetails;
