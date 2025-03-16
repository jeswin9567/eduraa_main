import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MVEHeader from '../mviewservicehead/menhead';
import './mupen.css';
import useAuth from '../../../../function/useAuth';

const MUpdateEntrance = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [entrance, setEntrance] = useState({
        name: '',
        details: '',
        education: '',
        degree: [], // Array for selected degrees
        marksGeneral: '',
        marksBackward: '',
        syllabus: '',
        howtoapply: '',
        link: '',
        startdate: '',
        enddate: '',
        state: '',
        examType: ''
    });

    const [errors, setErrors] = useState({});

    const states = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
    const examType = ['B.Tech', 'MBA', 'MCA', 'Medical', 'Law', 'Other'];

    // Define dynamic degree options
    const ugDegrees = ['BSW', 'BSc', 'BCA', 'BCom', 'BA', 'BTech', 'General Nursing', 'Other UG Courses including Mathematics'];
    const pgDegrees = ['MSW', 'MSc', 'MCA', 'MCom', 'MA', 'MTech', 'Other PG Courses including Mathematics'];

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newErrors = { ...errors };

        // Validation logic
        if (name === 'name') {
            const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
            const validCombination = /^[a-zA-Z0-9() ]+$/; // Alphabets, numbers, spaces, and parentheses
        
            if (value.trim() === '') {
                newErrors.name = 'Name cannot be empty or contain only spaces';
            } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
                newErrors.name = 'Name cannot consist of only numbers';
            } else if (!validCombination.test(value)) {
                newErrors.name = 'Name can only contain alphabets, numbers, spaces, and parentheses';
            } else if (!/[\d()]/.test(value) && !onlyAlphabets.test(value)) {
                newErrors.name = 'Only alphabets allowed if not using a combination';
            } else {
                delete newErrors.name; // Clear errors
            }
        }
        

        if (name === 'details') {
            const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
            const validCombination = /^[a-zA-Z0-9(),.() ]+$/; // Alphabets, numbers, commas, periods, parentheses, and spaces
        
            if (value.trim() === '') {
                newErrors.details = 'Details cannot be empty or contain only spaces';
            } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
                newErrors.details = 'Details cannot consist of only numbers';
            } else if (!validCombination.test(value)) {
                newErrors.details = 'Details can only contain alphabets, numbers, commas, periods, parentheses, and spaces';
            } else if (!/[\d(),.()]/.test(value) && !onlyAlphabets.test(value)) {
                newErrors.details = 'Only alphabets allowed if not using a combination';
            } else {
                delete newErrors.details; // Clear errors
            }
        }
        

        if (name === 'marksGeneral' && !/^(0|[1-9][0-9]?|100)$/.test(value)) {
            newErrors.marksGeneral = 'Marks for General Category must be a number between 0 and 100 without leading zeros or invalid repetitions';
        } else {
            delete newErrors.marksGeneral;
        }

        if (name === 'marksBackward' && !/^(0|[1-9][0-9]?|100)$/.test(value)) {
            newErrors.marksBackward = 'Marks for Backward Category must be a number between 0 and 100';
        } else {
            delete newErrors.marksBackward;
        }

        if (name === 'syllabus') {
            const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
            const validCombination = /^[a-zA-Z0-9(),.() ]+$/; // Alphabets, numbers, commas, periods, parentheses, and spaces
        
            if (value.trim() === '') {
                newErrors.syllabus = 'Syllabus cannot be empty or contain only spaces';
            } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
                newErrors.syllabus = 'Syllabus cannot consist of only numbers';
            } else if (!validCombination.test(value)) {
                newErrors.syllabus = 'Syllabus can only contain alphabets, numbers, commas, periods, parentheses, and spaces';
            } else if (!/[\d(),.()]/.test(value) && !onlyAlphabets.test(value)) {
                newErrors.syllabus = 'Only alphabets allowed if not using a combination';
            } else {
                delete newErrors.syllabus; // Clear errors
            }
        }
        

        if (name === 'howtoapply') {
            const onlyAlphabets = /^[a-zA-Z ]+$/; // Only alphabets and spaces
            const validCombination = /^[a-zA-Z0-9(),.() ]+$/; // Alphabets, numbers, commas, periods, parentheses, and spaces
        
            if (value.trim() === '') {
                newErrors.howtoapply = 'How to Apply cannot be empty or contain only spaces';
            } else if (/^\d+$/.test(value)) { // Check if the input contains only numbers
                newErrors.howtoapply = 'How to Apply cannot consist of only numbers';
            } else if (!validCombination.test(value)) {
                newErrors.howtoapply = 'How to Apply can only contain alphabets, numbers, commas, periods, parentheses, and spaces';
            } else if (!/[\d(),.()]/.test(value) && !onlyAlphabets.test(value)) {
                newErrors.howtoapply = 'Only alphabets allowed if not using a combination';
            } else {
                delete newErrors.howtoapply; // Clear errors
            }
        }
        

        if (name === 'link' && !/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/.test(value)) {
            newErrors.link = 'Please enter a valid link';
        } else {
            delete newErrors.link;
        }

        if (name === 'startdate') {
            const currentYear = new Date().getFullYear();
            const selectedStartDate = new Date(value);
            if (selectedStartDate.getFullYear() !== currentYear) {
                newErrors.startdate = 'Start date must be within the current year';
            } else {
                delete newErrors.startdate;
            }
        }

        if (name === 'enddate') {
            const selectedEndDate = new Date(value);
            const selectedStartDate = new Date(entrance.startdate);
            if (selectedEndDate < selectedStartDate) {
                newErrors.enddate = 'End date must not be before the start date';
            } else {
                delete newErrors.enddate;
            }
        }

        setErrors(newErrors);

        setEntrance((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDegreeChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setEntrance((prev) => ({
                ...prev,
                degree: [...prev.degree, value],
            }));
        } else {
            setEntrance((prev) => ({
                ...prev,
                degree: prev.degree.filter((deg) => deg !== value),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length > 0) {
            alert('Please fix the errors before submitting');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/upentr/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entrance),
            });

            if (response.ok) {
                alert('Entrance updated successfully');
                navigate(`/manager/entrance`);
            } else {
                const errorMessage = await response.text();
                alert(`Failed to update the entrance: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error updating entrance:', error);
            alert('Could not update entrance. Please try again later.');
        }
    };

    return (
        <div>
            <MVEHeader />
            <div className="manupdentr">
                <h1>Update Entrance Details</h1>
                <form onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={entrance.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                    <label>Details</label>
                    <textarea
                        name="details"
                        value={entrance.details}
                        onChange={handleChange}
                        placeholder="Details"
                        required
                    />
                    {errors.details && <p className="error">{errors.details}</p>}
                    <label>Exam Type</label>
                    <select
                        name="examType"
                        value={entrance.examType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Exam Type</option>
                        {examType.map((examType) => (
                            <option key={examType} value={examType}>
                                {examType}
                            </option>
                        ))}
                    </select>
                    {errors.examType && <p className="error">{errors.examType}</p>}
                    <label>Education Required</label>
                    <select
                        name="education"
                        value={entrance.education}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Education Level</option>
                        <option value="10">Class 10</option>
                        <option value="+2">Class 12</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                    </select>
                    {errors.education && <p className="error">{errors.education}</p>}

                    <label>State</label>
                    <select
                        name="state"
                        value={entrance.state}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select State</option>
                        {states.map((state, index) => (
                            <option key={index} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                    {errors.state && <p className="error">{errors.state}</p>}

                    <div>
                        <label>Select Degrees:</label>
                        {entrance.education === 'Undergraduate' && ugDegrees.map((degree) => (
                            <div key={degree}>
                                <input
                                    type="checkbox"
                                    value={degree}
                                    checked={entrance.degree.includes(degree)}
                                    onChange={handleDegreeChange}
                                />
                                <label>{degree}</label>
                            </div>
                        ))}
                        {entrance.education === 'Postgraduate' && pgDegrees.map((degree) => (
                            <div key={degree}>
                                <input
                                    type="checkbox"
                                    value={degree}
                                    checked={entrance.degree.includes(degree)}
                                    onChange={handleDegreeChange}
                                />
                                <label>{degree}</label>
                            </div>
                        ))}
                    </div>
                    <label>Marks for General Category</label>
                    <input
                        type="text"
                        name="marksGeneral"
                        value={entrance.marksGeneral}
                        onChange={handleChange}
                        placeholder="Marks for General Category"
                        required
                    />
                    {errors.marksGeneral && <p className="error">{errors.marksGeneral}</p>}
                    <label>Marks for Backward Category</label>
                    <input
                        type="text"
                        name="marksBackward"
                        value={entrance.marksBackward}
                        onChange={handleChange}
                        placeholder="Marks for Backward Category"
                        required
                    />
                    {errors.marksBackward && <p className="error">{errors.marksBackward}</p>}
                    <label>Syllabus</label>
                    <textarea
                        name="syllabus"
                        value={entrance.syllabus}
                        onChange={handleChange}
                        placeholder="Syllabus"
                        required
                    />
                    {errors.syllabus && <p className="error">{errors.syllabus}</p>}
                    <label>How to Apply</label>
                    <textarea
                        name="howtoapply"
                        value={entrance.howtoapply}
                        onChange={handleChange}
                        placeholder="How to Apply"
                        required
                    />
                    {errors.howtoapply && <p className="error">{errors.howtoapply}</p>}
                    <label>Link</label>
                    <input
                        type="url"
                        name="link"
                        value={entrance.link}
                        onChange={handleChange}
                        placeholder="Link"
                        required
                    />
                    {errors.link && <p className="error">{errors.link}</p>}
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startdate"
                        value={entrance.startdate.split('T')[0]}
                        onChange={handleChange}
                        required
                    />
                    {errors.startdate && <p className="error">{errors.startdate}</p>}
                    <label>End Date</label>
                    <input
                        type="date"
                        name="enddate"
                        value={entrance.enddate.split('T')[0]}
                        onChange={handleChange}
                        required
                    />
                    {errors.enddate && <p className="error">{errors.enddate}</p>}
                    <button type="submit">Update Entrance</button>
                    <button type="button" onClick={() => navigate(-1)}>
                        BACK
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MUpdateEntrance;
