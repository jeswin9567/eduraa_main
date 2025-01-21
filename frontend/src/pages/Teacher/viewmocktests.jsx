import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeachMockTestList from "../../components/teacher/mocktest/viewmocktests";
import './viewmocktests.css'

const TeacherViewMock = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="teachmocklistview-container">
                <Teachersidebrcom />
                <TeachMockTestList />
            </div>
        </div>
        </>
    );
}

export default TeacherViewMock;