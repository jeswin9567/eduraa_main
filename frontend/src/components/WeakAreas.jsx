import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeakAreas.css';
import { useNavigate } from 'react-router-dom';

const WeakAreas = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [generatingTest, setGeneratingTest] = useState(false);
    const userEmail = localStorage.getItem('userEmail');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/quiz/performance-analysis/${userEmail}`);
                console.log("Response data:", response.data);
                setAnalysisData(response.data.analysis);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analysis:', error);
                setLoading(false);
            }
        };

        if (userEmail) {
            fetchAnalysis();
        }
    }, [userEmail]);

    const handleGenerateTest = async (subject, topic) => {
        try {
            setGeneratingTest(true);
            console.log('Generating test for:', { subject, topic });

            const response = await axios.post('http://localhost:5000/quiz/generate-ai-test', {
                subject,
                topic
            });

            console.log('Test generation response:', response.data);

            if (response.data.mockTest?._id) {
                window.location.href = `/ai-mocktest/${response.data.mockTest._id}`;
            } else {
                throw new Error('No mock test ID received');
            }
        } catch (error) {
            console.error('Error generating test:', error);
            alert('Failed to generate practice test. Please try again.');
        } finally {
            setGeneratingTest(false);
        }
    };

    if (loading) {
        return <div className="loading-state">Analyzing your performance patterns...</div>;
    }

    if (!analysisData || !analysisData.weakTopics || analysisData.weakTopics.length === 0) {
        return <div className="weak-areas-empty">No weak areas identified. Keep up the good work!</div>;
    }

    const getSubjectTopics = (subject) => {
        return analysisData.weakTopics.filter(topic => topic.subject === subject);
    };

    return (
        <div className="weak-areas-main-container">
            <h2 className="weak-areas-main-title">Performance Analysis Report</h2>

            {/* Subject Overview Cards */}
            <div className="weak-performance-overview">
                {Object.entries(analysisData.bySubject || {}).map(([subject, data]) => (
                    <div 
                        key={subject} 
                        className={`weak-subject-card ${selectedSubject === subject ? 'selected' : ''}`}
                        onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                    >
                        <div className="weak-subject-header">{subject}</div>
                        <div className="weak-score-display">
                            <div className="weak-score-circle">
                                <span className="weak-score-value">
                                    {data && typeof data.overallScore === 'number' 
                                        ? data.overallScore.toFixed(1) 
                                        : 'N/A'}%
                                </span>
                                <span className="weak-score-label">Overall Score</span>
                            </div>
                        </div>
                        <div className="weak-click-hint">Click to view details</div>
                    </div>
                ))}
            </div>

            {/* Selected Subject Analysis */}
            {selectedSubject && (
                <div className="weak-improvement-section">
                    <h3 className="weak-section-title">{selectedSubject} - Topics Requiring Attention</h3>
                    <div className="weak-topics-grid">
                        {getSubjectTopics(selectedSubject).map((topic, index) => (
                            <div key={index} className="weak-topic-card">
                                <div className="weak-topic-header">
                                    <h4 className="weak-topic-title">{topic.topic}</h4>
                                    <div className="weak-score-badges">
                                        <div className="weak-score-badge weak-your-score">
                                            <span className="weak-badge-label">Your Score</span>
                                            <span className="weak-badge-value">
                                                {typeof topic.averageScore === 'number' 
                                                    ? topic.averageScore.toFixed(1) 
                                                    : 'N/A'}%
                                            </span>
                                        </div>
                                        <div className="weak-score-badge weak-class-average">
                                            <span className="weak-badge-label">Topic Average</span>
                                            <span className="weak-badge-value">
                                                {topic.topicAverage || 'N/A'}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="weak-topic-details">
                                    <div className="weak-detail-label">Tests Taken:</div>
                                    <div className="weak-detail-content">{topic.description}</div>
                                </div>

                                <div className="weak-action-items">
                                    <div className="weak-action-header">Recommended Actions:</div>
                                    <div className="weak-suggestions-list">
                                        {analysisData.recommendations
                                            .find(r => r.subject === topic.subject && r.topic === topic.topic)
                                            ?.suggestions.map((suggestion, i) => (
                                                <div key={i} className="weak-suggestion-item">
                                                    <span className="weak-suggestion-icon">•</span>
                                                    {suggestion}
                                                </div>
                                            )) || <div>No specific recommendations available</div>}
                                    </div>
                                    
                                    {/* Action buttons container */}
                                    <div className="weak-action-buttons">
                                        <button 
                                            className="weak-practice-test-button"
                                            onClick={() => handleGenerateTest(topic.subject, topic.topic)}
                                            disabled={generatingTest}
                                        >
                                            {generatingTest ? 'Generating Test...' : 'Try More Practice Tests'}
                                        </button>
                                        <button 
                                            className="weak-view-results-button"
                                            onClick={() => navigate('/user/ai-quiz-results', {
                                                state: { 
                                                    subject: topic.subject,
                                                    title: topic.topic
                                                }
                                            })}
                                        >
                                            View Quiz Results
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeakAreas;