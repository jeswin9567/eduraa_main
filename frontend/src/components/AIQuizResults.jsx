import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AIQuizResults.css';

const ViewAIQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizDetails, setQuizDetails] = useState(null);
    const userEmail = localStorage.getItem('userEmail');
    const location = useLocation();
    const navigate = useNavigate();
    
    const subject = location.state?.subject;
    const title = location.state?.title;

    useEffect(() => {
        const fetchAIQuizzes = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/ai-quizzes/${userEmail}`);
                let filteredQuizzes = response.data.quizzes;

                if (subject && title) {
                    filteredQuizzes = filteredQuizzes.filter(quiz => 
                        quiz.subject.toLowerCase() === subject.toLowerCase() && 
                        quiz.title.toLowerCase() === title.toLowerCase()
                    );
                }

                setQuizzes(filteredQuizzes);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching AI quizzes:', error);
                setLoading(false);
            }
        };

        fetchAIQuizzes();
    }, [userEmail, subject, title]);

    const handleQuizClick = async (quiz) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/quiz-details/${quiz.mockTestId}`);
            const mockTest = response.data.mockTest;
            
            // Combine mock test questions with user's answers
            const detailedQuiz = {
                ...quiz,
                questions: mockTest.questions.map((q, index) => ({
                    ...q,
                    userAnswer: quiz.answers[index]
                }))
            };
            
            setQuizDetails(detailedQuiz);
            setSelectedQuiz(quiz);
        } catch (error) {
            console.error('Error fetching quiz details:', error);
        }
    };

    const closePopup = () => {
        setSelectedQuiz(null);
        setQuizDetails(null);
    };

    if (loading) {
        return (
            <div className="ai-quiz-loading">
                <div className="loading-spinner"></div>
                <p>Loading your quiz results...</p>
            </div>
        );
    }

    return (
        <div className="ai-quiz-page">
            <div className="ai-quiz-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i> Back
                </button>
                <h1 className="page-title">
                    {subject && title 
                        ? `Quiz Results: ${title}`
                        : 'AI Generated Quiz Results'
                    }
                </h1>
                {subject && <div className="subject-badge">{subject}</div>}
            </div>

            {quizzes.length === 0 ? (
                <div className="no-results-container">
                    <div className="no-results-icon">📝</div>
                    <h2>No Quiz Results Found</h2>
                    <p>{subject && title ? `Try taking a quiz in ${title}` : 'Start taking AI-generated quizzes to see your results here'}</p>
                </div>
            ) : (
                <div className="quiz-results-container">
                    <div className="performance-summary">
                        <div className="summary-card">
                            <h3>Total Quizzes</h3>
                            <div className="summary-value">{quizzes.length}</div>
                        </div>
                        <div className="summary-card">
                            <h3>Average Score</h3>
                            <div className="summary-value">
                                {(quizzes.reduce((acc, quiz) => acc + quiz.percentageScore, 0) / quizzes.length).toFixed(1)}%
                            </div>
                        </div>
                        <div className="summary-card">
                            <h3>Best Score</h3>
                            <div className="summary-value">
                                {Math.max(...quizzes.map(quiz => quiz.percentageScore)).toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    <div className="quiz-cards-grid">
                        {quizzes.map((quiz, index) => (
                            <div 
                                key={index} 
                                className="quiz-result-card"
                                onClick={() => handleQuizClick(quiz)}
                            >
                                <div className="quiz-card-header">
                                    <div className="quiz-info">
                                        <h3>{quiz.description}</h3>
                                        <span className="quiz-date">
                                            {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="score-circle" style={{
                                        background: `conic-gradient(
                                            #4CAF50 ${quiz.percentageScore * 3.6}deg, 
                                            #f0f0f0 ${quiz.percentageScore * 3.6}deg
                                        )`
                                    }}>
                                        <div className="score-inner">
                                            <span>{quiz.percentageScore.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="quiz-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Score</span>
                                        <span className="detail-value">{quiz.score}/{quiz.totalMarks}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Questions</span>
                                        <span className="detail-value">{quiz.totalQuestions}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Attempts</span>
                                        <span className="detail-value">{quiz.attempts}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quiz Details Popup */}
            {selectedQuiz && quizDetails && (
                <div className="quiz-details-overlay">
                    <div className="quiz-details-popup">
                        <div className="popup-header">
                            <h2>{quizDetails.description}</h2>
                            <button className="close-button" onClick={closePopup}>×</button>
                        </div>
                        <div className="popup-content">
                            <div className="quiz-summary">
                                <div className="summary-item">
                                    <span>Score:</span> {selectedQuiz.score}/{selectedQuiz.totalMarks}
                                </div>
                                <div className="summary-item">
                                    <span>Percentage:</span> {selectedQuiz.percentageScore.toFixed(1)}%
                                </div>
                            </div>
                            <div className="questions-list">
                                {quizDetails.questions.map((question, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`question-item ${
                                            question.userAnswer === question.correctAnswer 
                                                ? 'correct' 
                                                : 'incorrect'
                                        }`}
                                    >
                                        <div className="question-text">
                                            <span className="question-number">Q{idx + 1}.</span> 
                                            {question.question}
                                        </div>
                                        <div className="options-list">
                                            {question.options.map((option, optIdx) => (
                                                <div 
                                                    key={optIdx} 
                                                    className={`option ${
                                                        optIdx === question.correctAnswer 
                                                            ? 'correct-answer' 
                                                            : optIdx === question.userAnswer 
                                                                ? 'user-answer' 
                                                                : ''
                                                    }`}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="explanation">
                                            <strong>Explanation:</strong> {question.explanation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAIQuiz;
