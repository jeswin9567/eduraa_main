import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBook, FaClipboardList, FaGraduationCap, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const results = location.state?.results || {};

    return (
        <div className="search-page">
            <div className="search-results-container">
                <div className="search-header">
                    <h1>Search Results</h1>
                    <p>Found {Object.values(results).flat().length} results</p>
                </div>

                <div className="results-grid">
                    {results.courses?.length > 0 && (
                        <div className="result-section">
                            <div className="section-header">
                                <FaBook className="section-icon" />
                                <h2>Courses</h2>
                            </div>
                            <div className="results-list">
                                {results.courses.map(course => (
                                    <div 
                                        key={course._id} 
                                        className="result-card"
                                        onClick={() => handleItemClick('courses', course)}
                                    >
                                        <h3>{course.topic}</h3>
                                        <p>{course.subTopic}</p>
                                        <div className="teacher-info">
                                            By {course.teacherName}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.mockTests?.length > 0 && (
                        <div className="result-section">
                            <div className="section-header">
                                <FaClipboardList className="section-icon" />
                                <h2>Mock Tests</h2>
                            </div>
                            <div className="results-list">
                                {results.mockTests.map(test => (
                                    <div 
                                        key={test._id} 
                                        className="result-card"
                                        onClick={() => handleItemClick('mockTests', test)}
                                    >
                                        <h3>{test.title}</h3>
                                        <p>{test.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {results.scholarships?.length > 0 && (
                        <div className="result-section">
                            <div className="section-header">
                                <FaGraduationCap className="section-icon" />
                                <h2>Scholarships</h2>
                            </div>
                            <div className="results-list">
                                {results.scholarships.map(scholarship => (
                                    <div 
                                        key={scholarship._id} 
                                        className="result-card"
                                        onClick={() => handleItemClick('scholarships', scholarship)}
                                    >
                                        <h3>{scholarship.name}</h3>
                                        <p>{scholarship.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {Object.keys(results).every(key => !results[key]?.length) && (
                        <div className="empty-state">
                            <div className="empty-state-icon">🔍</div>
                            <h2>No results found</h2>
                            <p>Try different keywords or check your spelling</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults; 