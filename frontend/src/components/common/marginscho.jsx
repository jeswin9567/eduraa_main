import React, { useState } from 'react';
import './marginscho.css'; // Import the updated CSS file for styling

const MarginCScho = ({ setFilters }) => {
    const initialFilterState = {
        eligibility: [],
        subEligibility: {},
        gender: '',
        category: [],
        states: [], 
        awardDuration: [],
        annualIncome: '',
        marks: ''
    };

    const [filters, setFiltersState] = useState(initialFilterState);

    const eligibilityOptions = ['School', 'Undergraduate', 'Postgraduate', 'Diploma'];
    const genderOptions = ['Male', 'Female', 'Common', 'Other'];
    const categoryOptions = ['General', 'Scheduled Castes', 'Scheduled Tribes', 'OBC','Minority','Disabled'];
    const statesOptions = ['All India', 'Andhra Pradesh', 'Assam', 'Bihar', 'Goa'];
    const awardDurationOptions = ['Monthly', 'Yearly'];

    const schoolOptions = ['4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const undergraduateOptions = ['B.Sc', 'B.Com', 'B.A', 'B.Tech', 'BBA', 'Other'];
    const postgraduateOptions = ['M.Sc', 'M.Com', 'M.A', 'MBA', 'M.Tech', 'Other'];
    const diplomaOptions = ['Mechanical', 'Civil', 'Electrical', 'Computer Science', 'Electronics','Other'];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltersState((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleEligibilityChange = (option) => {
        setFiltersState((prevFilters) => {
            const updatedEligibility = prevFilters.eligibility.includes(option)
                ? prevFilters.eligibility.filter((item) => item !== option)
                : [...prevFilters.eligibility, option];

            return {
                ...prevFilters,
                eligibility: updatedEligibility,
                subEligibility: { ...prevFilters.subEligibility, [option]: [] }
            };
        });
    };

    const handleSubEligibilityChange = (eligibilityType, subOption) => {
        setFiltersState((prevFilters) => {
            const updatedSubEligibility = prevFilters.subEligibility[eligibilityType]?.includes(subOption)
                ? prevFilters.subEligibility[eligibilityType].filter((item) => item !== subOption)
                : [...(prevFilters.subEligibility[eligibilityType] || []), subOption];

            return {
                ...prevFilters,
                subEligibility: {
                    ...prevFilters.subEligibility,
                    [eligibilityType]: updatedSubEligibility
                }
            };
        });
    };

    const handleCheckboxChange = (e, category) => {
        const { value, checked } = e.target;
        setFiltersState((prevFilters) => {
            const newCategory = checked
                ? [...prevFilters[category], value]
                : prevFilters[category].filter((item) => item !== value);

            return {
                ...prevFilters,
                [category]: newCategory,
            };
        });
    };


    const clearFilters = () => {
        setFiltersState(initialFilterState);
        setFilters(initialFilterState);
    };

    const applyFilters = () => {
        console.log("Filters applied: ", filters);
        setFilters(filters);
    };

    return (
        <div className="schofilter-container">
            <h2>Filter Scholarships</h2>

            {/* Eligibility as checkboxes */}
            <div className="schofilter-group">
                <label>Eligibility:</label>
                {eligibilityOptions.map((option, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            value={option}
                            checked={filters.eligibility.includes(option)}
                            onChange={() => handleEligibilityChange(option)}
                        />
                        {option}
                    </label>
                ))}
            </div>

            {/* Subsections for each selected eligibility as checkboxes */}
            {filters.eligibility.includes('School') && (
                <div className="schofilter-group">
                    <label>Select Classes:</label>
                    {schoolOptions.map((option, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={filters.subEligibility['School']?.includes(option) || false}
                                onChange={() => handleSubEligibilityChange('School', option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {filters.eligibility.includes('Undergraduate') && (
                <div className="schofilter-group">
                    <label>Select Courses:</label>
                    {undergraduateOptions.map((option, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={filters.subEligibility['Undergraduate']?.includes(option) || false}
                                onChange={() => handleSubEligibilityChange('Undergraduate', option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {filters.eligibility.includes('Postgraduate') && (
                <div className="schofilter-group">
                    <label>Select Courses:</label>
                    {postgraduateOptions.map((option, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={filters.subEligibility['Postgraduate']?.includes(option) || false}
                                onChange={() => handleSubEligibilityChange('Postgraduate', option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {filters.eligibility.includes('Diploma') && (
                <div className="schofilter-group">
                    <label>Select Specializations:</label>
                    {diplomaOptions.map((option, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={filters.subEligibility['Diploma']?.includes(option) || false}
                                onChange={() => handleSubEligibilityChange('Diploma', option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}

            {/* Gender as radio buttons */}
            <div className="schofilter-group">
                <label>Gender:</label>
                {genderOptions.map((gender, index) => (
                    <label key={index}>
                        <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={filters.gender === gender}
                            onChange={handleFilterChange}
                        />
                        {gender}
                    </label>
                ))}
            </div>

            {/* Category as checkboxes */}
            <div className="schofilter-group">
                <label>Category:</label>
                {categoryOptions.map((category, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            value={category}
                            checked={filters.category.includes(category)}
                            onChange={(e) => handleCheckboxChange(e, 'category')}
                        />
                        {category}
                    </label>
                ))}
            </div>

            {/* States as checkboxes */}
            <div className="schofilter-group">
                <label>States:</label>
                {statesOptions.map((state, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            value={state}
                            checked={filters.states.includes(state)}
                            onChange={(e) => handleCheckboxChange(e, 'states')}
                        />
                        {state}
                    </label>
                ))}
            </div>

            {/* Award Duration as checkboxes */}
            <div className="schofilter-group">
                <label>Award Duration:</label>
                {awardDurationOptions.map((option, index) => (
                    <label key={index}>
                        <input
                            type="checkbox"
                            value={option}
                            checked={filters.awardDuration.includes(option)}
                            onChange={(e) => handleCheckboxChange(e, 'awardDuration')}
                        />
                        {option}
                    </label>
                ))}
            </div>

            {/* Annual Income input */}
            <div className="schofilter-group">
                <label>Annual Income (max):</label>
                <input
                    type="number"
                    name="annualIncome"
                    value={filters.annualIncome}
                    onChange={handleFilterChange}
                    placeholder="Enter maximum income"
                    min="0"
                />
            </div>

            {/* Minimum Marks input */}
            <div className="schofilter-group">
                <label>Minimum Marks:</label>
                <input
                    type="number"
                    name="marks"
                    value={filters.marks}
                    onChange={handleFilterChange}
                    placeholder="Enter minimum marks"
                    min="0"
                />
            </div>

            <button className="schofilter-button" onClick={applyFilters}>
                Apply Filters
            </button>
            <button className="schofilter-button" onClick={clearFilters}>
                Clear Filters
            </button>
        </div>
    );
};

export default MarginCScho;
