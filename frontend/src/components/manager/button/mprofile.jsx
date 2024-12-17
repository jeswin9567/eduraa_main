import React from "react";
import { useNavigate } from "react-router-dom";
import SessEmail from "../../namesession";

    
const ManProfileBtn = () => {
    const navigate = useNavigate();
    return(
        <>
        <div>
            <button onClick={ () => navigate('/manager/profile')}
                style={{
                    fontSize:'14px',
                }}
                ><SessEmail /></button>
        </div>
        </>
    );
}

export default ManProfileBtn;