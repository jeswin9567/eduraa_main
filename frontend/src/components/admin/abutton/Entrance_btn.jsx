import React from "react";
import { useNavigate } from "react-router-dom";

function AddEntrace() {

    const navigate = useNavigate();
    return (
        <>
        <div>
            <button onClick={ () => navigate('/addEntrance')}>Entrance</button>
        </div>
        </>
    );
}

export default AddEntrace;