import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function TeachMockButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="managerservicebtnnn-container">
      <button
        className="managerservicebtnnn-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Mocktest
      </button>

      {showDropdown && (
        <div className="managerservicebtnnn-dropdown">
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/teacher/addmocktest')}
          >
            Add
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/teacher/mocktestlist')}
          >
            Manage
          </button>
        </div>
      )}
    </div>
  );
}

export default TeachMockButton;
