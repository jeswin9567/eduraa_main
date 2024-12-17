import React from "react";
import { useNavigate } from "react-router-dom";
import SessEmail from "../../namesession";

function Prof() {
    const navigate = useNavigate();

    return (
        <>
            <div>
                <button id = "profile" 
                    onClick={() => navigate("/uvpro")} 
                    style={{
                        backgroundColor: 'transparent', 
                        border: 'none', 
                        color: '#004429', 
                        fontSize: '14px', 
                        cursor: 'pointer'
                    }}
                >
                    <SessEmail />
                </button>
            </div>
        </>
    );
}

export default Prof;
