import React from "react";
import { useNavigate } from "react-router-dom";

function AddLoan() {

    const navigate = useNavigate();
    return (
        <>
        <div>
            <button onClick={ () => navigate('/addloan')}>Loan</button>
        </div>
        </>
    );
}

export default AddLoan;