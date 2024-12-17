import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../admin/abutton/servicebtn.css'

function PriceBtn() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div 
      className="adminserv-container" 
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <button className="adminserv-button">
        Amount
      </button>

      {showDropdown && (
        <div className="adminbtndropdown">
          <button className="adminbtndropdown-item" onClick={ () => navigate('/manager/price')}>Add</button>
          <button className="adminbtndropdown-item" onClick={ () => navigate('/manager/vprice')}>Manage</button>

        </div>
      )}
    </div>
  );
}

export default PriceBtn;
