import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherMockTestUpdateCom from "../../components/teacher/mocktest/updatemocktest";
import './updatemocktest.css'

const TeacherUpdateMockTest = () => {
    return(
        <>
        <div>
            <TeacherDashHead />
            <div className="teacherupdatemts-container">
                <Teachersidebrcom />
                <TeacherMockTestUpdateCom />
            </div>

        </div>
        </>
    );
}

export default TeacherUpdateMockTest;
