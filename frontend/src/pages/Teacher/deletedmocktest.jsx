import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherDeletedMockTestsCom from "../../components/teacher/mocktest/deletedmocktest";
import './deletedmocktest.css';

const TeacherDeletedMock = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teacherdelmockte-container">
                <Teachersidebrcom />
                <TeacherDeletedMockTestsCom />
            </div>

        </div>
        </>
    );
};

export default TeacherDeletedMock;