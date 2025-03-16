import React, { useEffect, useState } from 'react';
import './entrance.css';
import VHeader from '../../../components/user/vhead';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../../function/useAuth';

const UVEntranceDetails = () => {
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
                console.error('Error fetching entrance details:', error);
                alert('Could not fetch entrance details. Please try again later.');
            }
        };

        fetchEntranceDetails();
    }, [id]);

    if (!entrance) return <div>Loading...</div>;

    return (
        <div>
            <VHeader />
            <div className="userviewentr">
                {/* Heading at the top */}
                <h1>{entrance.name}</h1>

                {/* Content below the heading with separate headings for each section */}
                <div className="userviewentr-content">
                    <h2>Details</h2>
                    <p>{entrance.details}</p>

                    <h2>Exam Type</h2>
                    <p>{entrance.examType}</p>

                    <h2>Education Level</h2>
                    <p>{entrance.education || 'N/A'}</p>

                    <h2>Degrees Offered</h2>
                    <p>{entrance.degree.length > 0 ? entrance.degree.join(', ') : 'N/A'}</p>

                    <h2>Marks for General Category</h2>
                    <p>{entrance.marksGeneral || 'N/A'}</p>

                    <h2>Marks for Backward Category</h2>
                    <p>{entrance.marksBackward || 'N/A'}</p>

                    <h2>States</h2>
                    <p>{entrance.state}</p>

                    <h2>Syllabus</h2>
                    <p>{entrance.syllabus || 'N/A'}</p>

                    <h2>How to Apply</h2>
                    <p>{entrance.howtoapply || 'N/A'}</p>

                    <h2>Link</h2>
                    <p><a href={entrance.link} target="_blank" rel="noopener noreferrer">{entrance.link}</a></p>

                    <h2>Start Date</h2>
                    <p>{new Date(entrance.startdate).toLocaleDateString()}</p>

                    <h2>End Date</h2>
                    <p>{new Date(entrance.enddate).toLocaleDateString()}</p>
                </div>

                {/* Back button at the bottom */}
                <div className="userviewentr-button-container">
                    <button className="userviewentr-back-button" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </div>
    );
};

export default UVEntranceDetails;
