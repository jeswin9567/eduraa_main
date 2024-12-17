import React, { useEffect, useState } from 'react';
import './Scholarlist.css';
import { Link } from 'react-router-dom';

const ScholarshipList = ({ filters }) => {
    const [scholarships, setScholarships] = useState([]);

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const queryParams = new URLSearchParams({
                    eligibility: filters.eligibility.join(','),
                    subEligibility: Object.values(filters.subEligibility).flat().join(','),
                    gender: filters.gender,
                    category: filters.category.join(','),
                    states: filters.states.join(','),
                    awardDuration: filters.awardDuration.join(','),
                    annualIncome: filters.annualIncome ? filters.annualIncome : '', 
                    marks: filters.marks,
                }).toString();

                const response = await fetch(`http://localhost:5000/viewscho?${queryParams}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setScholarships(data);
            } catch (error) {
                console.error('Failed to fetch scholarships:', error);
            }
        };

        fetchScholarships();
    }, [filters]); // Add filters as a dependency

    return (
        <div className="scholarship-list">
            {scholarships.length > 0 ? (
                scholarships.map((scholarship) => (
                    <div key={scholarship._id} className="scholarship-item">
                        <Link to={`/scholarshipdetails/${scholarship._id}`}>
                            <div className="scholarship-name">{scholarship.name}</div>
                            <div className="scholarship-dates">
                                {scholarship.startdate && scholarship.enddate
                                    ? `${new Date(scholarship.startdate).toLocaleDateString()} - ${new Date(scholarship.enddate).toLocaleDateString()}`
                                    : 'Dates not available'}
                            </div>
                        </Link>
                    </div>
                ))
            ) : (
                <div>No scholarships available based on current filters.</div>
            )}
        </div>
    );
};

export default ScholarshipList;
