import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function MPriceButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="managerservicebtnnn-container">
      <button
        className="managerservicebtnnn-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Payment 
      </button>

      {showDropdown && (
        <div className="managerservicebtnnn-dropdown">
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/price')}
          >
            Add
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/vprice')}
          >
           Manage
          </button>

        </div>
      )}
    </div>
  );
}

export default MPriceButton;
