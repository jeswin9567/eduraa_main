import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../admin/abutton/servicebtn.css";

function MAddscholar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => setIsDropdownOpen(false);
  return (
    <>
      <div
        className="adminserv-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="adminserv-button">Scholar</button>
        {isDropdownOpen && (
          <div className="adminbtndropdown">
            <div
              onClick={() => navigate("/maddScholarship")}
              className="adminbtndropdown-item"
            >
              Add
            </div>
            <div
              onClick={() => navigate("/mvdelscho")}
              className="adminbtndropdown-item"
            >
              Manage
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MAddscholar;
