import React from "react";
import { useNavigate } from "react-router-dom";
import SessEmail from "../../namesession";

const ManProfileBtn = () => {
    const navigate = useNavigate();
    
    return (
        <div className="profile-button-container">
            <div 
                className="profile-content"
                onClick={() => navigate('/manager/profile')}
                style={{
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <SessEmail />
            </div>
        </div>
    );
}

export default ManProfileBtn;