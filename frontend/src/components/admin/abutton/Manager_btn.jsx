import React, { useState } from "react";
import './Manager_btn.css'; // Import the CSS file for styling
import { useNavigate } from "react-router-dom";

function AddManager() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div 
      className="manager-container" 
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <button id = "manager"className="manager-button">
        Manager
      </button>

      {showDropdown && (
        <div className="dropdown">
          <button id ="addManager" className="dropdown-item" onClick={ () => navigate('/addManager')}>Add</button>
          <button id = "manageButton"className="dropdown-item" onClick={() => navigate("/admin/manager")}>Manage</button>
        </div>
      )}
    </div>
  );
}

export default AddManager;
