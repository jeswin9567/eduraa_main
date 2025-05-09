import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import StudentProgress from "../../components/teacher/StudentProgress";
import './viewscheduleliveclassAll.css'
import useAuth from "../../../function/useAuth";

const ViewStudentPr = () => {
    useAuth();
    return (
        <>
            <div>
                <TeacherDashHead />
                <div className="viewAllSchedli-container">
                    <Teachersidebrcom />
                    <StudentProgress />
                </div>
            </div>

        </>
    )
}
export default ViewStudentPr;