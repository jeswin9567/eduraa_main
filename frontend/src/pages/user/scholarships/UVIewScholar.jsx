import React, { useEffect, useState } from 'react';
import './UViewScholar.css'
import VHeader from '../../../components/user/vhead';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../../function/useAuth';

const UVScholarshipDetails = () => {
    useAuth(); 
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/viewscho/${id}`);
            const data = await response.json();
            setScholarship(data);
        };

        fetchScholarshipDetails();
    }, [id]);

    if (!scholarship) return <div>Loading...</div>;

    return (
        <div>
            <VHeader />
            <div className="userviewschlr-details">
                <h1>{scholarship.name}</h1>
                <h3>Details</h3>
                <p>{scholarship.description}</p>
                <h3>Maximum Amount</h3>
                <p>{scholarship.award} Rs</p>
                <p>{scholarship.awardDuration}</p>
                <h3>Eligibility</h3>
                <p>{scholarship.eligibility}</p>
                <div className="uviewensub-eligibility">
                    {scholarship.subEligibility.map((sub, index) => (
                        <span key={index} className="uviewensub-eligibility-item">{sub}</span>
                    ))}
                </div>
                <h3>States</h3>
                <p>{scholarship.states}</p>
                <h3>Minimum Marks Required</h3>
                <p>{scholarship.marks}</p>
                <h3>Gender</h3>
                <p>{scholarship.gender}</p>
                <h3>Category</h3>
{scholarship.category.map((cat, index) => (
    <p key={index}>{cat}</p> // Each category will be in its own paragraph
))}
                <h3>Maximum Annual Income</h3>
                <p>{scholarship.annualIncome}</p>
                <h3>Documents Required</h3>
                <p>{scholarship.document}</p>
                <h3>How to Apply</h3>
                <p>{scholarship.howToApply}</p>
                <h3>Link</h3>
                <p><a href={scholarship.link} target="_blank" rel="noopener noreferrer">{scholarship.link}</a></p>
                <p className="uventdate"><strong>Start Date:</strong> {new Date(scholarship.startdate).toLocaleDateString()}</p>
                <p className="uventdate"><strong>End Date:</strong> {new Date(scholarship.enddate).toLocaleDateString()}</p>
                <div className="uventbutton-container">
                    <button className="uventback-button" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default UVScholarshipDetails;
