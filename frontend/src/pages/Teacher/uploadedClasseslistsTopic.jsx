import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import SubtopicsPageCom from "../../components/teacher/courses/managecoursesubtopic";
import './uploadedClasseslistsTopic.css'
import useAuth from "../../function/useAuth";

const TeachUploadedClassesLists = () => {
    useAuth();
    return (
        <> 
        <div>
            <TeacherDashHead />
            <div className="listclassastopic-container">
                <Teachersidebrcom />
                <SubtopicsPageCom />

            </div>
        </div>
        
        </>
    )
}

export default TeachUploadedClassesLists;