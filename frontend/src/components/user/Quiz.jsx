import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import FeedbackModal from './Feedback';
import './Quiz.css';

const UQuizPage = () => {
  const navigate = useNavigate();
  const { mockTestId } = useParams();
  const [mockTest, setMockTest] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Retrieve user data from local storage
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchMockTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/mocktest/umocktest/${mockTestId}`);
        setMockTest(response.data);
        await fetchUserResults(); // Fetch user results
      } catch (error) {
        console.error('Error fetching mock test:', error);
        setErrorMessage('Failed to load the quiz. Please try again later.');
      }
    };
    fetchMockTest();
  }, [mockTestId]);

  // Fetch previous user's answers and score
  const fetchUserResults = async () => {
    if (!userEmail) return;

    try {
      const response = await axios.get(`http://localhost:5000/quiz/results/${mockTestId}`, {
        params: { email: userEmail }, // Send email as a query parameter
      });
      if (response.data) {
        setUserAnswers(response.data.answers);
        setScore(response.data.score);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error fetching user results:', error);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (!submitted) {
      setUserAnswers({
        ...userAnswers,
        [questionIndex]: optionIndex,
      });
    }
  };

  const calculateScore = async () => {
    let calculatedScore = 0;
    mockTest.questions.forEach((question, index) => {
      const correctOptionIndex = question.options.findIndex((option) => option.isCorrect);
      if (userAnswers[index] === correctOptionIndex) {
        calculatedScore += question.marks;
      }
    });
    setScore(calculatedScore);
    setSubmitted(true);
  
    await saveAnswers(calculatedScore);
    await incrementParticipateCount(); // Increment participate count
  };
  
  // Function to increment participate count
  const incrementParticipateCount = async () => {
    try {
      await axios.post('http://localhost:5000/user/user/incrementParticipate', {
        email: userEmail,
      });
      console.log('Participate count incremented successfully');
    } catch (error) {
      console.error('Error incrementing participate count:', error);
    }
  };
  

  const handleBack = () => {
    console.log("Navigating back");
    navigate(-1);
  };

  const saveAnswers = async (calculatedScore) => {
    if (!userEmail) {
      console.error('User email missing');
      return;
    }

    const answersToSave = {
      email: userEmail, // Include email here
      mockTestId,
      answers: userAnswers,
      score: calculatedScore,
    };

    try {
      await axios.post('http://localhost:5000/quiz/saveAnswers', answersToSave);
      console.log('Answers saved successfully');
    } catch (error) {
      console.error('Error saving answers:', error);
    }
  };

  const handleRestart = async () => {
    if (!userEmail) {
      console.error('User email missing');
      return;
    }

    const deleteData = {
      email: userEmail,
      mockTestId,
    };

    try {
      await axios.delete('http://localhost:5000/quiz/deleteAnswers', { data: deleteData });
      console.log('Answers deleted successfully.');
    } catch (error) {
      console.error('Error deleting answers:', error);
    }

    // Reset local state after deleting the data
    setUserAnswers({}); // Clear user answers
    setScore(null); // Clear the score
    setSubmitted(false); // Mark the quiz as not submitted
  };

  // Function to handle feedback submission
  const handleSubmitFeedback = async (feedback) => {
    const entranceExamName = mockTest.entranceExamName || "Unknown Exam"; // Set a default if undefined
  
    console.log({
      email: userEmail,
      mockTestId,
      feedback,
      entranceExamName,
      mockTestName: mockTest.title,
    });
  
    try {
      await axios.post('http://localhost:5000/feed/feedback', {
        email: userEmail,
        mockTestId,
        feedback,
        entranceExamName,
        mockTestName: mockTest.title,
      });
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  


  if (!mockTest) return <div className="loading">{errorMessage || 'Loading...'}</div>;

  return (
    <div className="quizattmpt-container">
      <h2 className="quizattmpt-title">{mockTest.title}</h2>
      <p className="quizattmpt-description">{mockTest.description}</p>

      <div className="quizattmpt-all-questions">
        {mockTest.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="quizattmpt-question-section">
            <h3 className="quizattmpt-question-number">Question {questionIndex + 1}</h3>
            <p className="quizattmpt-question-text">{question.questionText}</p>
            <div className="quizattmpt-options-section">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`quizattmpt-option-button ${userAnswers[questionIndex] === optionIndex ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                  disabled={submitted}
                >
                  {option.optionText}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={calculateScore} className="quizattmpt-submit-button" disabled={submitted}>
        {submitted ? 'Submitted' : 'Submit'}
      </button>

      <button className="quizattmpt-submit-button" onClick={handleBack}>
        Back
      </button>

      {/* New View Steps button, only visible after quiz is submitted */}
      {submitted && (
        <button className="quizattmpt-view-steps-button" onClick={() => navigate(`/user/answers/${mockTestId}`)}>
          View Steps
        </button>
      )}

      {/* Show the result below the submit button */}
      {submitted && score !== null && (
        <div className="quizattmpt-result-section">
          <h3 className="quizattmpt-completed">Quiz Completed!</h3>
          <p className="quizattmpt-score">Your Score: {score} / {mockTest.totalMarks}</p>
          <button onClick={handleRestart} className="quizattmpt-restart-button">Restart Quiz</button>
          <button onClick={() => setShowFeedbackModal(true)} className="quizattmpt-feedback-button">Feedback</button>
        </div>
        
      )}
      <FeedbackModal
        isOpen={showFeedbackModal}
        closeModal={() => setShowFeedbackModal(false)}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </div>
    
  );
};

export default UQuizPage;
