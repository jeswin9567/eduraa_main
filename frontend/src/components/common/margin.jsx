import React, { useState } from 'react';
import './margin.css'; // Import the CSS file for styling

const MarginC = ({ setFilters }) => {
    const initialFilterState = {
        bankName: [],
        loanType: [],
        fieldOfStudy: [], // Added fieldOfStudy
        amount: 1000000, // Default amount value
        interestRate: 10 // Default interest rate value
    };

    const [filters, setFiltersState] = useState(initialFilterState);

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;

        setFiltersState((prevFilters) => ({
            ...prevFilters,
            [name]: checked
                ? [...prevFilters[name], value] // Add to array if checked
                : prevFilters[name].filter((item) => item !== value) // Remove if unchecked
        }));
    };

    const handleRangeChange = (e) => {
        setFiltersState({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const applyFilters = () => {
        console.log('Filters applied:', filters);
        setFilters(filters); // Update the parent component's filter state
    };

    const clearFilters = () => {
        setFiltersState(initialFilterState); // Reset filters to initial state
        setFilters(initialFilterState); // Also reset filters in parent component
    };

    // Dynamic configuration for filters
    const filterConfig = {
        bankName: {
            label: 'Bank Name',
            type: 'checkbox',
            options: ['State Bank of India', 'Axis Bank', 'Federal Bank','HDFC Bank','ICICI Bank', 'Canara Bank']
        },
        loanType: {
            label: 'Loan Type',
            type: 'checkbox',
            options: ['domestic', 'international']
        },
        fieldOfStudy: {
            label: 'Field of Study',  // Added Field of Study filter
            type: 'checkbox',
            options: ['Engineering', 'Medicine', 'Business', 'Law', 'Arts', 'Science', 'Technology']
        },
        amount: {
            label: 'Amount',
            type: 'range',
            field: 'amount', // Single field for range
            min: 0,
            max: 5000000, // Set the slider's min/max for amount
            step: 10000 // Set step size for slider
        },
        interestRate: {
            label: 'Interest Rate',
            type: 'range',
            field: 'interestRate', // Single field for range
            min: 0,
            max: 20, // Set slider's min/max for interest rate
            step: 0.1 // Set step size for slider
        }
    };

    return (
        <div className="my-componentfilter">
            {Object.keys(filterConfig).map((filterKey) => {
                const filter = filterConfig[filterKey];

                if (filter.type === 'checkbox') {
                    return (
                        <div key={filterKey} className="loanfilter-item">
                            <label>{filter.label}:</label>
                            {filter.options.map((option) => (
                                <div key={option}>
                                    <input
                                        type="checkbox"
                                        name={filterKey}
                                        value={option}
                                        checked={filters[filterKey].includes(option)}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label>{option}</label>
                                </div>
                            ))}
                        </div>
                    );
                }

                if (filter.type === 'range') {
                    return (
                        <div key={filterKey} className="loanfilter-item">
                            <label>{filter.label}:</label>
                            <div className="range-group">
                                <input
                                    type="range"
                                    name={filter.field}
                                    min={filter.min}
                                    max={filter.max}
                                    step={filter.step}
                                    value={filters[filter.field]}
                                    onChange={handleRangeChange}
                                />
                                <span>{filters[filter.field]}</span>
                            </div>
                        </div>
                    );
                }

                return null;
            })}

            {/* Apply Filter Button */}
            <button className="loanfilter-apply-button" onClick={applyFilters}>
                Apply Filters
            </button>

            {/* Clear Filter Button */}
            <button className="loanfilter-clear-button" onClick={clearFilters}>
                Clear Filters
            </button>
        </div>
    );
};

export default MarginC;
