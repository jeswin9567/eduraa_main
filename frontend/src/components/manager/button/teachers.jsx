import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MTeacherButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="managerservicebtnnn-container">
      <button
        className="managerservicebtnnn-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Teachers
      </button>

      {showDropdown && (
        <div className="managerservicebtnnn-dropdown">
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/viewteacherrequests')}
          >
            Requests
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/viewteacher')}
          >
            Teacher list
          </button>

        </div>
      )}
    </div>
  );
}

export default MTeacherButton;
