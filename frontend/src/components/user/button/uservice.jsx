import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../admin/abutton/servicebtn.css'

function UServiceButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div 
      className="adminserv-container" 
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <button className="adminserv-button">
        Services
      </button>

      {showDropdown && (
        <div className="adminbtndropdown">
          <button className="adminbtndropdown-item" onClick={ () => navigate('/scholarship')}>Scholarship</button>
          <button className="adminbtndropdown-item" onClick={ () => navigate('/loan')}>Loan</button>
          <button className="adminbtndropdown-item" onClick={ () => navigate('/entrance')}>Entrance</button>
        </div>
      )}
    </div>
  );
}

export default UServiceButton;
