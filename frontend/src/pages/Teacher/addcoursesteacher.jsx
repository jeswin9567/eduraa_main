import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import UploadClass from "../../components/teacher/courses/addCoursescomp";
import './addcoursesteacher.css'
import useAuth from "../../../function/useAuth";

const TeachAddCourse = () => {
    useAuth();
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teachercourseaddsmain-container">
                <Teachersidebrcom />
                <UploadClass />
            </div>
        </div>
        </>
    )
}

export default TeachAddCourse;