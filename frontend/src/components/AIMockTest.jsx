import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AIMockTest.css';

const AIMockTest = () => {
    const [test, setTest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTestComplete, setIsTestComplete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail');
    const [showExplanation, setShowExplanation] = useState(false);

    // Fetch test data
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/quiz/ai-mocktest/${id}`);
                console.log('Test data:', response.data);
                
                if (response.data.success && response.data.mockTest) {
                    // Validate that questions exist and are properly structured
                    if (!response.data.mockTest.questions || !Array.isArray(response.data.mockTest.questions)) {
                        throw new Error('Invalid test data: missing or invalid questions');
                    }
                    setTest(response.data.mockTest);
                    setCurrentQuestion(0);
                    setLoading(false);
                } else {
                    throw new Error('Test data not found');
                }
            } catch (error) {
                console.error('Error fetching test:', error);
                setError(error.message || 'Test not found. Please try again.');
                setLoading(false);
            }
        };
        fetchTest();
    }, [id]);

    // Timer logic
    useEffect(() => {
        if (!test || isTestComplete) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Move to next question when time runs out
                    if (currentQuestion < test.questions.length - 1) {
                        setCurrentQuestion(prev => prev + 1);
                        return 60;
                    } else {
                        handleTestSubmit();
                        return 0;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, test, isTestComplete]);

    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestion < test.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setTimeLeft(60);
        } else {
            handleTestSubmit();
        }
    };

    const handleTestSubmit = async () => {
        setIsTestComplete(true);
        
        // Calculate score
        let score = 0;
        const answersMap = new Map();
        
        Object.entries(selectedAnswers).forEach(([questionIndex, answerIndex]) => {
            answersMap.set(questionIndex.toString(), answerIndex);
            if (answerIndex === test.questions[questionIndex].correctAnswer) {
                score++;
            }
        });
        
        try {
            // Save test results with generatedBy field set to 'ai'
            await axios.post('http://localhost:5000/quiz/saveAnswers', {
                email: userEmail,
                mockTestId: test._id,
                answers: Object.fromEntries(answersMap),
                score,
                totalMarks: test.questions.length,
                subject: test.subject,
                title: test.topic,
                description: test.description || `AI Generated Test on ${test.topic}`,
                totalQuestions: test.questions.length,
                percentageScore: (score / test.questions.length) * 100,
                generatedBy: 'ai'
            });

            // Navigate to results page
            navigate('/user/ai-dashboard', { 
                state: { 
                    message: `Test completed! Your score: ${score}/${test.questions.length}`,
                    score,
                    total: test.questions.length
                }
            });
        } catch (error) {
            console.error('Error saving test results:', error);
            alert('Error saving your results. Please try again.');
        }
    };

    // Add null check for test and questions
    if (loading) return <div className="ai-mocktest-loading">Loading...</div>;
    if (error) return <div className="ai-mocktest-error">{error}</div>;
    if (!test || !test.questions || !test.questions.length) {
        return <div className="ai-mocktest-error">No questions available</div>;
    }

    const currentQ = test.questions[currentQuestion];
    if (!currentQ) {
        return <div className="ai-mocktest-error">Question not found</div>;
    }

    return (
        <div className="ai-mocktest-container">
            <div className="test-header">
                <h2>{test.topic} - Practice Test</h2>
                <div className="test-progress">
                    <div className="progress-text">
                        Question {currentQuestion + 1}/{test.questions.length}
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{width: `${((currentQuestion + 1) / test.questions.length) * 100}%`}}
                        ></div>
                    </div>
                </div>
                <div className="timer">
                    <div className="timer-icon">⏱️</div>
                    <div className="timer-text">{timeLeft}s</div>
                </div>
            </div>

            <div className="question-container">
                <p className="question-text">{currentQ.question}</p>
                <div className="options-container">
                    {currentQ.options && currentQ.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(currentQuestion, index)}
                        >
                            <span className="option-letter">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <span className="option-text">{option}</span>
                        </button>
                    ))}
                </div>
                
                {showExplanation && currentQ.explanation && (
                    <div className="explanation-box">
                        <h4>Explanation:</h4>
                        <p>{currentQ.explanation}</p>
                    </div>
                )}
            </div>

            <div className="navigation-buttons">
                <button 
                    className="explanation-button"
                    onClick={() => setShowExplanation(!showExplanation)}
                >
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </button>
                <button 
                    className="next-button"
                    onClick={handleNextQuestion}
                >
                    {currentQuestion < test.questions.length - 1 ? 'Next Question' : 'Submit Test'}
                </button>
            </div>
        </div>
    );
};

// Add some CSS for the explanation
const styles = `
.explanation-box {
    margin-top: 20px;
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 8px;
    border-left: 4px solid #4CAF50;
}

.explanation-button {
    background-color: #2196F3;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    margin-right: 10px;
    cursor: pointer;
}

.explanation-button:hover {
    background-color: #1976D2;
}
`;

export default AIMockTest; 