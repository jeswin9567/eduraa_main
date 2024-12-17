import React, { useState } from 'react';
import './marginen.css';

const MarginCEntr = ({ setFilters }) => {
  const initialFilterState = {
    education: [],
    examType: [],
    state: [],
    degrees: [],
  };
  const [filters, setFiltersState] = useState(initialFilterState);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(filters); // Apply filters when the form is submitted
  };

  const clearFilters = () => {
    setFiltersState(initialFilterState);
    setFilters(initialFilterState);
  };

  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isUndergraduateOpen, setIsUndergraduateOpen] = useState(false);
  const [isPostgraduateOpen, setIsPostgraduateOpen] = useState(false);
  const [isExamTypeOpen, setIsExamTypeOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);

  const examTypes = ['B.Tech', 'MBA', 'MCA', 'Medical', 'Law', 'Other'];
  const educationLevels = ['10', '+2', 'Undergraduate', 'Postgraduate'];
  const states = ['All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  const undergraduateDegrees = ['BA', 'BSc', 'BCom', 'BTech', 'BCA'];
  const postgraduateDegrees = ['MA', 'MSc', 'MCom', 'MTech', 'MBA'];

  return (
    <div className="entrfiltr-container">
      <form onSubmit={handleSubmit}>
        {/* Education Level Section */}
        <div className="entrfiltr-group">
          <div className="entrfiltr-header" onClick={() => setIsEducationOpen(!isEducationOpen)}>
            <h3>Education Level {isEducationOpen ? '▲' : '▼'}</h3>
          </div>
          {isEducationOpen && (
            <div className="entrfiltr-options">
              {educationLevels.map((level) => (
                <div key={level} className="entrfiltr-checkbox-group">
                  <input
                    type="checkbox"
                    value={level}
                    checked={filters.education.includes(level)}
                    onChange={(e) => handleCheckboxChange(e, 'education')}
                  />
                  <label>{level}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Undergraduate Degrees Section */}
        {filters.education.includes('Undergraduate') && (
          <div className="entrfiltr-group">
            <div className="entrfiltr-header" onClick={() => setIsUndergraduateOpen(!isUndergraduateOpen)}>
              <h3>Undergraduate Degrees {isUndergraduateOpen ? '▲' : '▼'}</h3>
            </div>
            {isUndergraduateOpen && (
              <div className="entrfiltr-options">
                {undergraduateDegrees.map((degree) => (
                  <div key={degree} className="entrfiltr-checkbox-group">
                    <input
                      type="checkbox"
                      value={degree}
                      checked={filters.degrees.includes(degree)}
                      onChange={(e) => handleCheckboxChange(e, 'degrees')}
                    />
                    <label>{degree}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Postgraduate Degrees Section */}
        {filters.education.includes('Postgraduate') && (
          <div className="entrfiltr-group">
            <div className="entrfiltr-header" onClick={() => setIsPostgraduateOpen(!isPostgraduateOpen)}>
              <h3>Postgraduate Degrees {isPostgraduateOpen ? '▲' : '▼'}</h3>
            </div>
            {isPostgraduateOpen && (
              <div className="entrfiltr-options">
                {postgraduateDegrees.map((degree) => (
                  <div key={degree} className="entrfiltr-checkbox-group">
                    <input
                      type="checkbox"
                      value={degree}
                      checked={filters.degrees.includes(degree)}
                      onChange={(e) => handleCheckboxChange(e, 'degrees')}
                    />
                    <label>{degree}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Exam Type Section */}
        <div className="entrfiltr-group">
          <div className="entrfiltr-header" onClick={() => setIsExamTypeOpen(!isExamTypeOpen)}>
            <h3>Exam Type {isExamTypeOpen ? '▲' : '▼'}</h3>
          </div>
          {isExamTypeOpen && (
            <div className="entrfiltr-options">
              {examTypes.map((exam) => (
                <div key={exam} className="entrfiltr-checkbox-group">
                  <input
                    type="checkbox"
                    value={exam}
                    checked={filters.examType.includes(exam)}
                    onChange={(e) => handleCheckboxChange(e, 'examType')}
                  />
                  <label>{exam}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* State Section */}
        <div className="entrfiltr-group">
          <div className="entrfiltr-header" onClick={() => setIsStateOpen(!isStateOpen)}>
            <h3>State {isStateOpen ? '▲' : '▼'}</h3>
          </div>
          {isStateOpen && (
            <div className="entrfiltr-options">
              {states.map((state) => (
                <div key={state} className="entrfiltr-checkbox-group">
                  <input
                    type="checkbox"
                    value={state}
                    checked={filters.state.includes(state)}
                    onChange={(e) => handleCheckboxChange(e, 'state')}
                  />
                  <label>{state}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="entrfiltr-button">Apply Filters</button>
        <br></br>
        <br></br>
        <button type="button" className="entrfiltr-button" onClick={clearFilters}>Clear Filters</button>
      </form>
    </div>
  );
};

export default MarginCEntr;
