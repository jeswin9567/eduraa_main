import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeachViewMockTestDetails from "../../components/teacher/mocktest/viewmocktestdetails";
import './viewmocktestdetails.css'
import useAuth from "../../../function/useAuth";

const TeacherViewMockDetails = () => {
    useAuth();
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teacherviewmockdetails-container">
                <Teachersidebrcom />
                <TeachViewMockTestDetails />
            </div>

        </div>
        </>
    )
}

export default TeacherViewMockDetails ;