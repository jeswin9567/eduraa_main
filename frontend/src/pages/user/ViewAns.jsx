import React from "react";
import ViewStepsPage from "../../components/user/Viewanswers";
import useAuth from "../../function/useAuth";

const ViewAns = () => {
    useAuth();
    return (
        <>
        <div>
            <ViewStepsPage />
        </div>
        </>

    );
}

export default ViewAns;