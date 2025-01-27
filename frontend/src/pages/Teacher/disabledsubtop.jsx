import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import DisSubtopicsPageCom from "../../components/teacher/courses/disabledcoursesubtopics";
import './disabledsubtopic.css'

const DisabledSubT = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="disabpag-container">
                <Teachersidebrcom />
                <DisSubtopicsPageCom />
            </div>

        </div>
        </>
    )
}

export default DisabledSubT;