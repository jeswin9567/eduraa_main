import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function LiveClassBtn() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="managerservicebtnnn-container">
      <button
        className="managerservicebtnnn-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Live Class
      </button>

      {showDropdown && (
        <div className="managerservicebtnnn-dropdown">
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/teacher/scheduleclass')}
          >
            Schelude 
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/teacher/viewscheduleclasses')}
          >
            View All
          </button>

        </div>
      )}
    </div>
  );
}

export default LiveClassBtn;
