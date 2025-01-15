import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function MockTestBtn() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleMouseEnter = () => setIsDropdownOpen(true);
    const handleMouseLeave = () => setIsDropdownOpen(false);
    return (
        <>
         <div className="adminserv-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="adminserv-button">Mock Test</button>
            {isDropdownOpen && (
                <div className="adminbtndropdown">
                    <div onClick={() => navigate('/manager/mocktest')} className="adminbtndropdown-item">Add</div>
                    <div onClick={() => navigate('/manager/managemocktest')} className="adminbtndropdown-item">Manage</div>
                    <div onClick={() => navigate('/manager/deletedmocktest')} className="adminbtndropdown-item">Deleted</div>
                </div>
            )}
        </div>
        </>
    );
}

export default MockTestBtn


