import React from "react";
import UQuizPage from "../../components/user/Quiz";
import useAuth from "../../../function/useAuth";

const Quiz = () => {
    useAuth();
    return (
        <>
        <div>
            <UQuizPage />
        </div>
        </>
    );
}

export default Quiz;