import React from "react";
import { useNavigate } from "react-router-dom";

function Addscholar() {
    const navigate = useNavigate();
    return (
        <>
        <div>
            <button onClick = {() => navigate('/addscholar')}>Scholarship</button>
        </div>
        </>
    );
}

export default Addscholar;