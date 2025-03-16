import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import UpdateSubtopicPage from "../../components/teacher/courses/updateCourse";
import './updatecourspage.css'
import useAuth from "../../function/useAuth";

const UpdCoursePage = () => {
    useAuth();
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="updatecoursepg-container">
                <Teachersidebrcom />
                <UpdateSubtopicPage />

            </div>
        </div>
        
        </>
    );
}

export default UpdCoursePage;