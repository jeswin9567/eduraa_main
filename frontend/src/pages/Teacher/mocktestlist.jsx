import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherMockEntranceExamListCom from "../../components/teacher/mocktest/mocktestlistentr";
import './mocktestlist.css'
import useAuth from "../../function/useAuth";

const TeacherMocktestList = () => {
    useAuth();
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teachermocklistentc-container">
                <Teachersidebrcom />
                <TeacherMockEntranceExamListCom/>
            </div>

        </div>
        </>
    )
}

export default TeacherMocktestList;