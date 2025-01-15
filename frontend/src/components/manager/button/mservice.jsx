import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import '../../admin/abutton/servicebtn.css'

function MServiceButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="managerservicebtnnn-container">
      <button
        className="managerservicebtnnn-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Services
      </button>

      {showDropdown && (
        <div className="managerservicebtnnn-dropdown">
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/scholarship')}
          >
            Scholarship
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/loan')}
          >
            Loan
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/entrance')}
          >
            Entrance
          </button>
        </div>
      )}
    </div>
  );
}

export default MServiceButton;
