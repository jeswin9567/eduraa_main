import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function TeachCousreButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="managerservicebtnnn-container">
      <button
        className="managerservicebtnnn-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Courses
      </button>

      {showDropdown && (
        <div className="managerservicebtnnn-dropdown">
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/teacher/addcourses')}
          >
            Add Courses
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/teacher/managecourses')}
          >
            Manage Courses
          </button>
          
        </div>
      )}
    </div>
  );
}

export default TeachCousreButton;
