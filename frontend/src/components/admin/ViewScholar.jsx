import React, { useEffect, useState } from 'react';
import './ViewScholar.css';
import VSHeader from './aviewservicehead/aschohead';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../function/useAuth';

const VScholarshipDetails = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            const response = await fetch(`http://localhost:5000/viewscho/${id}`);
            if (!response.ok) {
                alert('Failed to fetch scholarship details');
                return;
            }
            const data = await response.json();
            setScholarship(data);
        };

        fetchScholarshipDetails();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this scholarship?");
        if (!confirmDelete) return; // Cancel deletion if user chooses not to proceed

        try {
            const response = await fetch(`http://localhost:5000/delscho/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Scholarship deleted successfully');
                navigate('/admin/scholar'); // Redirect to the scholarship list or desired page
            } else {
                const errorMessage = await response.text();
                alert(`Failed to delete the scholarship: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting scholarship:', error);
            alert('Could not delete scholarship. Please try again later.');
        }
    };

    if (!scholarship) return <div>Loading...</div>;

    return (
        <div>
            <VSHeader />
            <div className="scholarship-details">
                <h1>{scholarship.name}</h1>
                <p><strong>Details:</strong>{scholarship.description}</p>
                <p><strong>Duration:</strong>{scholarship.awardDuration}</p>
                <p><strong>Award:</strong> Rs {scholarship.award}</p>
                <p><strong>State:</strong>{scholarship.states}</p>
                <p><strong>Eligibility:</strong> {scholarship.eligibility}</p>
                <p><strong></strong></p>
                    <div className="sub-eligibility">
                        {scholarship.subEligibility.map((sub, index) => (
                        <span key={index} className="sub-eligibility-item">{sub}</span>
                        ))}
                    </div>
                <p><strong>Annual Income:</strong>{scholarship.annualIncome}</p>
                <p><strong>Minimum Marks:</strong>{scholarship.marks}</p>
                <p><strong>Gender:</strong>{scholarship.gender}</p>
                <p><strong>Category:</strong>{scholarship.category}</p>
                <p><strong>Documents Required:</strong>{scholarship.document}</p>
                <p><strong>How to Apply:</strong> {scholarship.howToApply}</p>
                <p className="date"><strong>Start Date:</strong> {new Date(scholarship.startdate).toLocaleDateString()}</p>
                <p className="date"><strong>End Date:</strong> {new Date(scholarship.enddate).toLocaleDateString()}</p>
                <p><strong>Link:</strong> <a href={scholarship.link} target="_blank" rel="noopener noreferrer">{scholarship.link}</a></p>
                <div className="button-container">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                    {/* Add Update button */}
                    <button className="update-button" onClick={() => navigate(`/updatescho/${id}`)}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default VScholarshipDetails;
