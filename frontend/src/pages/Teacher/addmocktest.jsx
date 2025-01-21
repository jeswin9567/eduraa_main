import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherMocktest from "../../components/teacher/mocktest/addmocktest";
import './addmocktestteach.css'

const TeacherAddMock = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teacheraddmocktest-container">
                <Teachersidebrcom />
                <TeacherMocktest />
            </div>
        </div>
        </>
    );
}

export default TeacherAddMock; 