import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateFlBtn() {
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="managerservicebtnnn-container">
      <button
        className="managerservicebtnnn-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Entrance Field
      </button>

      {showDropdown && (
        <div className="managerservicebtnnn-dropdown">
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/addfields')}
          >
            Add
          </button>
          <button
            className="managerservicebtnnn-dropdown-item"
            onClick={() => navigate('/manager/updatefields')}
          >
            Update
          </button>

        </div>
      )}
    </div>
  );
}

export default UpdateFlBtn;
