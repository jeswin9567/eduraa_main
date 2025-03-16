import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherMocktest from "../../components/teacher/mocktest/addmocktest";
import './addmocktestteach.css'
import useAuth from "../../function/useAuth";

const TeacherAddMock = () => {
    useAuth();
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