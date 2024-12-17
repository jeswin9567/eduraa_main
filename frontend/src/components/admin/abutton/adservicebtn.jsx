import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './servicebtn.css'

function ServiceButton() {
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
          <button className="adminbtndropdown-item" onClick={ () => navigate('/admin/scholar')}>Scholarship</button>
          <button className="adminbtndropdown-item" onClick={ () => navigate('/admin/loan')}>Loan</button>
          <button className="adminbtndropdown-item" onClick={ () => navigate('/admin/entrance')}>Entrance</button>
        </div>
      )}
    </div>
  );
}

export default ServiceButton;
