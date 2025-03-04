import React, { useEffect, useState, useCallback } from 'react';
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
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerActive, setTimerActive] = useState(true);

  // Retrieve user data from local storage
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchMockTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/mocktest/umocktest/${mockTestId}`);
        setMockTest(response.data);
        
        // Get the start time from localStorage
        const startTime = localStorage.getItem('quizStartTime');
        if (startTime) {
          const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
          const remainingTime = (response.data.duration * 60) - elapsedSeconds;
          setTimeLeft(Math.max(0, remainingTime)); // Ensure time doesn't go negative
        } else {
          setTimeLeft(response.data.duration * 60);
        }
        
        await fetchUserResults();
      } catch (error) {
        console.error('Error fetching mock test:', error);
        setErrorMessage('Failed to load the quiz. Please try again later.');
      }
    };
    fetchMockTest();

    // Cleanup function to remove the start time when component unmounts
    return () => {
      localStorage.removeItem('quizStartTime');
    };
  }, [mockTestId]);

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0 && !submitted) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, submitted]);

  const handleTimeUp = useCallback(async () => {
    if (!submitted) {
      await calculateScore();
      setSubmitted(true);
      setTimerActive(false);
    }
  }, [submitted]);

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
      console.log(`Selected answer for question ${questionIndex + 1}:`, optionIndex); // Debug log
      console.log('Option details:', mockTest.questions[questionIndex].options[optionIndex]); // Debug log
      
      setUserAnswers(prev => {
        const newAnswers = {
          ...prev,
          [questionIndex]: optionIndex
        };
        console.log('Updated user answers:', newAnswers); // Debug log
        return newAnswers;
      });
    }
  };

  // Add this shuffle function
  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  // Modify handleRestart function
  const handleRestart = async () => {
    if (!userEmail) {
        console.error('User email missing');
        return;
    }

    try {
        // Only increment the attempts counter without changing other data
        const response = await axios.put(`http://localhost:5000/quiz/incrementAttempts/${mockTestId}`, {
            email: userEmail
        });

        console.log('Attempts incremented:', response.data);
        
        // Reset local state for new attempt
        const shuffledMockTest = {
            ...mockTest,
            questions: mockTest.questions.map(question => ({
                ...question,
                options: shuffleArray([...question.options])
            }))
        };
        
        setMockTest(shuffledMockTest);
        setUserAnswers({});
        setScore(null);
        setSubmitted(false);
        
        // Reset timer and store new start time
        setTimeLeft(mockTest.duration * 60);
        localStorage.setItem('quizStartTime', Date.now().toString());
        setTimerActive(true);
        
    } catch (error) {
        console.error('Error restarting quiz:', error);
        alert('Failed to restart quiz. Please try again.');
    }
  };

  // Modify calculateScore function to handle shuffled options
  const calculateScore = async () => {
    try {
        let calculatedScore = 0;
        console.log('Calculating score...'); // Debug log
        console.log('User answers:', userAnswers); // Debug log
        console.log('Questions:', mockTest.questions); // Debug log

        mockTest.questions.forEach((question, index) => {
            if (userAnswers[index] !== undefined) {
                const selectedOption = question.options[userAnswers[index]];
                console.log(`Question ${index + 1}:`); // Debug log
                console.log('Selected option:', selectedOption); // Debug log
                console.log('Question marks:', question.marks); // Debug log
                
                if (selectedOption && selectedOption.isCorrect) {
                    calculatedScore += question.marks;
                    console.log(`Adding ${question.marks} marks. New total: ${calculatedScore}`); // Debug log
                }
            }
        });
        
        console.log('Final calculated score:', calculatedScore); // Debug log
        setScore(calculatedScore);
        setSubmitted(true);

        // Check if this is a retry
        const isRetry = await checkIfRetry();
        
        // Wait for both operations to complete
        await Promise.all([
            saveAnswers(calculatedScore, isRetry),
            incrementParticipateCount()
        ]);

        console.log('Score calculated and saved:', calculatedScore);
    } catch (error) {
        console.error('Error in calculateScore:', error);
        alert('There was an error saving your quiz results.');
    }
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
  
  // Add this function to check if it's a retry
  const checkIfRetry = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/quiz/results/${mockTestId}`, {
            params: { email: userEmail }
        });
        return response.data && response.data.attempts > 1;
    } catch (error) {
        console.error('Error checking retry status:', error);
        return false;
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

    const totalMarks = mockTest.totalMarks;
    console.log('Total marks:', totalMarks, 'Score:', calculatedScore);

    const answersToSave = {
        email: userEmail,
        mockTestId,
        answers: userAnswers,
        score: calculatedScore,
        totalMarks: totalMarks,
        subject: mockTest.subject,
        title: mockTest.title,
        description: mockTest.description,
        totalQuestions: mockTest.questions.length,
        percentageScore: (calculatedScore / totalMarks) * 100
    };

    try {
        // Update the quiz without incrementing attempts
        const response = await axios.put(
            `http://localhost:5000/quiz/updateQuizAttempt/${mockTestId}`, 
            answersToSave
        );
        console.log('Save response:', response.data);
    } catch (error) {
        console.error('Error saving answers:', error.response?.data || error.message);
        alert('Failed to save quiz results. Please try again.');
    }
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
  

  // Format time function
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmit = async () => {
    try {
        // Prevent multiple submissions
        if (submitted) return;

        // Validate that we have all required data
        if (!mockTest || !userEmail || !mockTestId) {
            console.error('Missing required data:', { mockTest, userEmail, mockTestId });
            alert('Missing required data. Please try again.');
            return;
        }

        // Calculate total score
        let totalScore = 0;
        Object.keys(userAnswers).forEach(questionIndex => {
            const question = mockTest.questions[questionIndex];
            const selectedOption = userAnswers[questionIndex];
            if (question.options[selectedOption]?.isCorrect) {
                totalScore += question.marks || 1;
            }
        });

        // Prepare quiz data
        const quizData = {
            email: userEmail,
            mockTestId: mockTestId,
            answers: userAnswers,
            score: totalScore,
            totalMarks: mockTest.totalMarks,
            subject: mockTest.subject,
            title: mockTest.title,
            description: mockTest.description,
            totalQuestions: mockTest.questions.length,
            percentageScore: (totalScore / mockTest.totalMarks) * 100
        };

        console.log('Submitting quiz data:', quizData); // Debug log

        const response = await axios.post('http://localhost:5000/quiz/saveAnswers', quizData);
        console.log('Quiz submission response:', response.data);

        setSubmitted(true);
        setScore(totalScore);
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('Failed to submit quiz. Please try again.');
    }
  };

  if (!mockTest) return <div className="loading">{errorMessage || 'Loading...'}</div>;

  return (
    <div className="quizattmpt-container">
      <div className="quizattmpt-header">
        <h2 className="quizattmpt-title">{mockTest.title}</h2>
        {!submitted && (
          <div className="quizattmpt-timer">
            Time Left: {formatTime(timeLeft)}
          </div>
        )}
      </div>
      <p className="quizattmpt-description">{mockTest.description}</p>

      <div className="quizattmpt-all-questions">
        {mockTest.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="quizattmpt-question-section">
            <h3 className="quizattmpt-question-number">Question {questionIndex + 1}</h3>
            <p className="quizattmpt-question-text">{question.questionText}</p>
            
            {/* Add the image display here */}
            {question.questionImage && (
              <div className="quizattmpt-question-image">
                <img 
                  src={question.questionImage} 
                  alt={`Question ${questionIndex + 1}`}
                  className="quizattmpt-image"
                />
              </div>
            )}

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

      <button 
        id="submit" 
        onClick={handleSubmit} 
        className="quizattmpt-submit-button" 
        disabled={submitted}
      >
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
