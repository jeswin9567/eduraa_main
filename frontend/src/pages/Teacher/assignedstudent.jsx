import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherAssignedStudentsCom from "../../components/teacher/viewassignedstucom";
import './addcoursesteacher.css'

const ViewAssignStudentPg = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teachercourseaddsmain-container">
                <Teachersidebrcom />
                <TeacherAssignedStudentsCom />
            </div>
            
        </div>
        </>
    );
}
export default ViewAssignStudentPg;