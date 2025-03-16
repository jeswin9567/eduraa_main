import React, { useEffect, useState } from 'react';
import './ViewEntrance.css'; // Create this CSS for styling
import VEHeader from './aviewservicehead/aenhead';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../function/useAuth';

const VEntranceDetails = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [entrance, setEntrance] = useState(null);

    useEffect(() => {
        const fetchEntranceDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/viewentr/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch entrance details');
                }
                const data = await response.json();
                setEntrance(data);
            } catch (error) {
                console.error(error);
                alert('Error fetching entrance details. Please try again later.');
            }
        };

        fetchEntranceDetails();
    }, [id]);

    const handleDelete = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/delentr/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Entrance deleted successfully');
            navigate('/admin/entrance'); // Redirect to the entrance list or desired page
        } else {
            alert('Failed to delete the entrance');
        }
    };

    if (!entrance) return <div>Loading...</div>;

    return (
        <div>
            <VEHeader />
            <div className="entrance-details">
                <h1>{entrance.name}</h1>

                <h3>Details</h3>
                <p>{entrance.details}</p>
                
                <h3>Exam Type</h3>
                <p>{entrance.examType}</p>

                <h3>Education Required</h3>
                <p>{entrance.education}</p>

                {entrance.degree && entrance.degree.length > 0 && (
                    <>
                        <h3>Degrees Applicable</h3>
                        <p>{entrance.degree.join(', ')}</p>
                    </>
                )}

                <h3>Marks for General Category</h3>
                <p>{entrance.marksGeneral}</p>

                <h3>Marks for Backward Category</h3>
                <p>{entrance.marksBackward}</p>

                <h3>State</h3>
                <p>{entrance.state}</p>

                <h3>Syllabus</h3>
                <p>{entrance.syllabus}</p>

                <h3>How to Apply</h3>
                <p>{entrance.howtoapply}</p>

                <h3>Link</h3>
                <p><a href={entrance.link} target="_blank" rel="noopener noreferrer">{entrance.link}</a></p>

                <h3>Start Date</h3>
                <p className="date">{new Date(entrance.startdate).toLocaleDateString()}</p>

                <h3>End Date</h3>
                <p className="date">{new Date(entrance.enddate).toLocaleDateString()}</p>

                <div className="button-container">
                    <button className="back-button" onClick={() => navigate(-1)}>Back</button>
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                    <button className="update-button" onClick={() => navigate(`/updateentr/${id}`)}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default VEntranceDetails;
