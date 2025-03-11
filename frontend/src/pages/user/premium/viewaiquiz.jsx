import React from "react";

import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import ViewAIQuiz from "../../../components/AIQuizResults";
import './userboxcrs.css';

const ViewAIQuizPage = () => {
    return (
        <>
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <ViewAIQuiz />
            </div>
        </div>
        </>
    )
};
export default ViewAIQuizPage;
