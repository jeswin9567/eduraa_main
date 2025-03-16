import React from "react";
import ViewTeacherCom from "../../components/manager/Teacher/ViewTeacher";
import useAuth from "../../../function/useAuth";

const ViewTeacherr = () => {
    useAuth();
    return (
        <>
        <div>
            <ViewTeacherCom />

        </div>
        </>
    );
}

export default ViewTeacherr