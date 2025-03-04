import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeakAreas.css';

const WeakAreas = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const userEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/quiz/performance-analysis/${userEmail}`);
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
        <div className="weak-areas-container">
            <h2 className="weak-areas-title">Performance Analysis Report</h2>

            {/* Subject Overview Cards */}
            <div className="performance-overview">
                {Object.entries(analysisData.bySubject || {}).map(([subject, data]) => (
                    <div 
                        key={subject} 
                        className={`subject-card ${selectedSubject === subject ? 'selected' : ''}`}
                        onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
                    >
                        <div className="subject-header">{subject}</div>
                        <div className="score-display">
                            <div className="score-circle">
                                <span className="score-value">
                                    {data && typeof data.overallScore === 'number' 
                                        ? data.overallScore.toFixed(1) 
                                        : 'N/A'}%
                                </span>
                                <span className="score-label">Overall Score</span>
                            </div>
                        </div>
                        <div className="click-hint">Click to view details</div>
                    </div>
                ))}
            </div>

            {/* Selected Subject Analysis */}
            {selectedSubject && (
                <div className="improvement-section">
                    <h3 className="section-title">{selectedSubject} - Topics Requiring Attention</h3>
                    <div className="topics-grid">
                        {getSubjectTopics(selectedSubject).map((topic, index) => (
                            <div key={index} className="topic-card">
                                <div className="topic-header">
                                    <h4 className="topic-title">{topic.topic}</h4>
                                    <div className="score-badges">
                                        <div className="score-badge your-score">
                                            <span className="badge-label">Your Score</span>
                                            <span className="badge-value">
                                                {typeof topic.averageScore === 'number' 
                                                    ? topic.averageScore.toFixed(1) 
                                                    : 'N/A'}%
                                            </span>
                                        </div>
                                        <div className="score-badge class-average">
                                            <span className="badge-label">Topic Average</span>
                                            <span className="badge-value">
                                                {topic.topicAverage || 'N/A'}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {topic.description && (
                                    <div className="topic-details">
                                        <div className="detail-label">Tests Taken:</div>
                                        <div className="detail-content">{topic.description}</div>
                                    </div>
                                )}

                                <div className="action-items">
                                    <div className="action-header">Recommended Actions:</div>
                                    <div className="suggestions-list">
                                        {analysisData.recommendations
                                            .find(r => r.subject === topic.subject && r.topic === topic.topic)
                                            ?.suggestions.map((suggestion, i) => (
                                                <div key={i} className="suggestion-item">
                                                    <span className="suggestion-icon">•</span>
                                                    {suggestion}
                                                </div>
                                            )) || <div>No specific recommendations available</div>}
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