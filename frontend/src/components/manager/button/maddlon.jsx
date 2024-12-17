import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../admin/abutton/servicebtn.css'

function MAddln() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleMouseEnter = () => setIsDropdownOpen(true);
    const handleMouseLeave = () => setIsDropdownOpen(false);
    return (
        <>
         <div className="adminserv-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="adminserv-button">Loan</button>
            {isDropdownOpen && (
                <div className="adminbtndropdown">
                    <div onClick={() => navigate('/maddLoan')} className="adminbtndropdown-item">Add</div>
                    <div onClick={() => navigate('/mvdelln')} className="adminbtndropdown-item">Manage</div>
                </div>
            )}
        </div>
        </>
    );
}

export default MAddln;