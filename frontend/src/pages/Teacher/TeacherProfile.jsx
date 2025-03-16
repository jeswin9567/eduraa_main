import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import ViewTeachProf from "../../components/teacher/ViewProfile";
import './TeacherProfile.css'
import useAuth from "../../../function/useAuth";

const TeacherProfile = () => {
    useAuth();
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="viewTeacherProfile-container">
            <Teachersidebrcom />
            <ViewTeachProf />
            </div>
        </div>
        </>
    );
};

export default TeacherProfile;