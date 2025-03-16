import React, { useEffect, useState } from 'react';
import './MViewScholar.css'
import MVSHeader from '../../components/manager/mviewservicehead/mschohead';
import Managersidebrcom from '../../components/manager/sidebarmain/sidebarmain';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../function/useAuth';

const MVScholarshipDetails = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState(null);

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/viewscho/${id}`);
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
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/delscho/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Scholarship deleted successfully');
                navigate('/manager/scholarship');
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
            <MVSHeader />
            <div className="managerscholarshipcontainer">
            <Managersidebrcom />
            <div className="managerscholarship-details">
                <h1>{scholarship.name}</h1>
                <p><strong>Details:</strong>{scholarship.description}</p>
                <p><strong>Award:</strong> Rs {scholarship.award}</p>
                <p><strong>State</strong>{scholarship.states}</p>
                <p><strong>Duration</strong>{scholarship.awardDuration}</p>
                <p><strong>Eligibility:</strong> {scholarship.eligibility}</p>
                <div className="managerscholarshipsub-eligibility">
                    {scholarship.subEligibility.map((sub, index) => (
                        <span key={index} className="managerscholarshipsub-eligibility-item">{sub}</span>
                    ))}
                </div>
                <p><strong>Annual Income</strong>{scholarship.annualIncome}</p>
                <p><strong>Minimum Mark</strong>{scholarship.marks}</p>
                <p><strong>Gender:</strong> {scholarship.gender}</p>
                <p><strong>Category:</strong> {scholarship.category}</p>
                <p><strong>Document Required:</strong> {scholarship.document}</p>
                <p><strong>How to Apply:</strong> {scholarship.howToApply}</p>
                <p className="date"><strong>Start Date:</strong> {new Date(scholarship.startdate).toLocaleDateString()}</p>
                <p className="date"><strong>End Date:</strong> {new Date(scholarship.enddate).toLocaleDateString()}</p>
                <p><strong>Link:</strong> <a href={scholarship.link} target="_blank" rel="noopener noreferrer">{scholarship.link}</a></p>
                <div className="managerscholarshipbutton-container">
                    <button className="managerscholarshipback-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="managerscholarshipdelete-button" onClick={handleDelete}>Delete</button>
                    <button className="managerscholarshipupdate-button" onClick={() => navigate(`/mupdatescholar/${id}`)}>Update</button>
                </div>
            </div>
            </div>
        </div>
    );
};

export default MVScholarshipDetails;
