import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VSHeader from '../aviewservicehead/aschohead';
import './uscho.css';
import useAuth from '../../../../function/useAuth';

const UpdateScholarship = () => {
    useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState({
        name: '',
        description: '',
        award: '',
        awardDuration: '',
        eligibility: '',
        howToApply: '',
        link: '',
        startdate: '',
        enddate: '',
        subEligibility: [],
        gender: '',
        category: [],
        document: '',
        states: '',
        annualIncome: '', // New field for annual income
        marks: '' // New field for marks
    });

    const states = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

    useEffect(() => {
        const fetchScholarshipDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/viewscho/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch scholarship details');
                }
                const data = await response.json();
                setScholarship({
                    ...data,
                    states: data.states || '', // Ensure states has a default value
                    annualIncome: data.annualIncome || '', // Ensure annualIncome has a default value
                    marks: data.marks || '' // Ensure marks has a default value
                });
            } catch (error) {
                console.error('Error fetching scholarship details:', error);
                alert('Could not fetch scholarship details. Please try again later.');
            }
        };

        fetchScholarshipDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setScholarship((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStateChange = (e) => {
        const selectedStates = Array.from(e.target.selectedOptions, (option) => option.value);
        setScholarship((prev) => ({
            ...prev,
            states: selectedStates // Update the states array
        }));
    };

    const handleEligibilityChange = (e) => {
        const { value } = e.target;
        setScholarship((prev) => ({
            ...prev,
            eligibility: value,
            subEligibility: [] // Reset subEligibility when eligibility changes
        }));
    };

    const handleSubEligibilityChange = (option) => {
        setScholarship((prev) => {
            const subEligibility = prev.subEligibility.includes(option)
                ? prev.subEligibility.filter((item) => item !== option)
                : [...prev.subEligibility, option];
            return { ...prev, subEligibility };
        });
    };

    const handleCategoryChange = (option) => {
        setScholarship((prev) => {
            const updatedCategories = prev.category.includes(option)
                ? prev.category.filter((item) => item !== option)
                : [...prev.category, option];
            return { ...prev, category: updatedCategories };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/upscho/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scholarship),
            });

            if (response.ok) {
                alert('Scholarship updated successfully');
                navigate(`/admin/scholar`);
            } else {
                const errorMessage = await response.text();
                alert(`Failed to update the scholarship: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error updating scholarship:', error);
            alert('Could not update scholarship. Please try again later.');
        }
    };

    const renderSubEligibilityOptions = () => {
        const options = [];
        switch (scholarship.eligibility) {
            case 'School':
                options.push('Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12');
                break;
            case 'Undergraduate':
                options.push('B.Sc', 'B.Com', 'B.A', 'B.Tech', 'B.E', 'BBA','Other');
                break;
            case 'Postgraduate':
                options.push('M.Sc', 'M.Com', 'M.A', 'MBA', 'M.Tech', 'M.E','Other');
                break;
            case 'Diploma':
                options.push('Mechanical', 'Civil', 'Electrical', 'Computer Science', 'Electronics','Other');
                break;
            default:
                return null;
        }

        return (
            <div>
                <label>Select Sub-Eligibility:</label>
                <div className="checkbox-group">
                    {options.map((option) => (
                        <label key={option}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={scholarship.subEligibility.includes(option)}
                                onChange={() => handleSubEligibilityChange(option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    const renderCategoryOptions = () => {
        const categories = ['General', 'Scheduled Castes', 'Scheduled Tribes', 'OBC','Minority','Disabled'];
        return (
            <div>
                <label>Select Category:</label>
                <div className="checkbox-group">
                    {categories.map((category) => (
                        <label key={category}>
                            <input
                                type="checkbox"
                                value={category}
                                checked={scholarship.category.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                            {category}
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <VSHeader />
            <div className="uscho">
                <h1 className="uscho-title">Update Scholarship Details</h1>
                <form onSubmit={handleSubmit} className="uscho-form">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={scholarship.name}
                        onChange={handleChange}
                        placeholder="Enter scholarship name"
                        required
                        className="uscho-input"
                    />

                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={scholarship.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        required
                        className="uscho-textarea"
                    />

                    <label>Award Amount:</label>
                    <input
                        type="number"
                        name="award"
                        value={scholarship.award}
                        onChange={handleChange}
                        placeholder="Enter award amount"
                        required
                        min="0"
                        className="uscho-input"
                    />

                    <label>Award Duration:</label>
                    <select
                        name="awardDuration"
                        value={scholarship.awardDuration}
                        onChange={handleChange}
                        required
                        className="uscho-input"
                    >
                        <option value="">Select Award Duration</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>

                    <label>Eligibility:</label>
                    <select
                        name="eligibility"
                        value={scholarship.eligibility}
                        onChange={handleEligibilityChange}
                        required
                        className="uscho-input"
                    >
                        <option value="">Select Eligibility</option>
                        <option value="School">School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Diploma">Diploma</option>
                    </select>

                    {renderSubEligibilityOptions()}

                    <label>Gender:</label>
                    <select
                        name="gender"
                        value={scholarship.gender}
                        onChange={handleChange}
                        required
                        className="uscho-input"
                    >
                        <option value="">Select Gender</option>
                        <option value="Common">Common</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    {renderCategoryOptions()}
                    <label>State:</label>
                    <select
                        name="states"
                        value={scholarship.states} // Ensure it's a single value
                        onChange={(e) => setScholarship({ ...scholarship, states: e.target.value })} // Update to single selection
                        className="uscho-input"
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>

                    <label>Documents Required:</label>
                    <textarea
                        type="text"
                        name="document"
                        value={scholarship.document}
                        onChange={handleChange}
                        placeholder="Enter documents required"
                        className="uscho-textarea"
                    />

                    <label>Annual Income:</label>
                    <input
                        type="number"
                        name="annualIncome"
                        value={scholarship.annualIncome} // Bind annualIncome
                        onChange={handleChange}
                        placeholder="Enter annual income"
                        required
                        min="0"
                        className="uscho-input"
                    />

                    <label>Marks:</label>
                    <input
                        type="number"
                        name="marks"
                        value={scholarship.marks} // Bind marks
                        onChange={handleChange}
                        placeholder="Enter required marks"
                        required
                        min="0"
                        className="uscho-input"
                    />

<label>Start Date:</label>
                    <input
                        type="date"
                        name="startdate"
                        value={scholarship.startdate.split('T')[0]}
                        onChange={handleChange}
                        required
                        className="uscho-input"
                    />

                    <label>End Date:</label>
                    <input
                        type="date"
                        name="enddate"
                        value={scholarship.enddate.split('T')[0]}
                        onChange={handleChange}
                        required
                        className="uscho-input"
                    />

                    <label>How to Apply:</label>
                    <textarea
                        name="howToApply"
                        value={scholarship.howToApply}
                        onChange={handleChange}
                        placeholder="Enter application process"
                        required
                        className="uscho-textarea"
                    />

                    <label>Link:</label>
                    <input
                        type="url"
                        name="link"
                        value={scholarship.link}
                        onChange={handleChange}
                        placeholder="Enter link to scholarship"
                        required
                        className="uscho-input"
                    />

                    <button type="submit" className="uscho-button">Update Scholarship</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateScholarship;
