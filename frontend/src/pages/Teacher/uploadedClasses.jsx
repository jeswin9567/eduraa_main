import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import VClassCom from "../../components/teacher/courses/managecoursescomp";
import './uploadedClasses.css'

const TeachUploadedClasses = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teachrupldclas-container">
                <Teachersidebrcom />
                <VClassCom />

            </div>
        </div>
        </>
    );
}

export default TeachUploadedClasses;