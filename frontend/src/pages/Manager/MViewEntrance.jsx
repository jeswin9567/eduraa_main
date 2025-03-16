import React, { useEffect, useState } from 'react';
import './MviewEntr.css'; // Create this CSS for styling
import MVEHeader from '../../components/manager/mviewservicehead/menhead';
import Managersidebrcom from '../../components/manager/sidebarmain/sidebarmain';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../../function/useAuth';

const MVEntranceDetails = () => {
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
            navigate('/manager/entrance'); // Redirect to the entrance list or desired page
        } else {
            alert('Failed to delete the entrance');
        }
    };

    if (!entrance) return <div>Loading...</div>;

    return (
        <div>
            <MVEHeader />
            <div className="managerviewentr-container">
            <Managersidebrcom />
            <div className="managerviewentr-details">
    <h1>{entrance.name}</h1>
    <h2>Details</h2>
    <p>{entrance.details}</p>

    <h2>Exam Type</h2>
    <p>{entrance.examType}</p>

    <h2>Education Required</h2>
    <p>{entrance.education}</p>



    {entrance.degree && entrance.degree.length > 0 && (
                    <>
                        <h3>Degrees Applicable</h3>
                        <p>{entrance.degree.join(', ')}</p>
                    </>
                )}


    <h2>State</h2>
    <p>{entrance.state}</p>

    <h2>Marks for General Category</h2>
    <p>{entrance.marksGeneral}</p>

    <h2>Marks for Backward Category</h2>
    <p>{entrance.marksBackward}</p>

    <h2>Syllabus</h2>
    <p>{entrance.syllabus}</p>

    <h2>How to Apply</h2>
    <p>{entrance.howtoapply}</p>

    <h2>Link</h2>
    <p><a href={entrance.link} target="_blank" rel="noopener noreferrer">{entrance.link}</a></p>

    <h2>Start Date</h2>
    <p>{new Date(entrance.startdate).toLocaleDateString()}</p>

    <h2>End Date</h2>
    <p>{new Date(entrance.enddate).toLocaleDateString()}</p>

    <div className="managerviewentr-button-container">
        <button className="managerviewentr-back-button" onClick={() => navigate(-1)}>Back</button>
        <button className="managerviewentr-delete-button" onClick={handleDelete}>Delete</button>
        <button className="managerviewentr-update-button" onClick={() => navigate(`/mupdateentrance/${id}`)}>Update</button>
    </div>
</div>
</div>

        </div>
    );
};

export default MVEntranceDetails;
