import React from "react";
import { useNavigate } from "react-router-dom";

const UMockTestBtn = () => {
    const navigate = useNavigate();
    return (
        <>
        <div>
            <button onClick={() => navigate("/user/mocktest")}>Mock Test</button>

        </div>
        </>
    );
}

export default UMockTestBtn ;