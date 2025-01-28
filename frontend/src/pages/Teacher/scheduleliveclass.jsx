import React from "react";
import ScheduleLiveClassCom from "../../components/teacher/courses/liveClassComp";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import './scheduleliveclass.css'


const ScheduleLiveClass = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="schedllivclz-container">
                <Teachersidebrcom />
                <ScheduleLiveClassCom />
            </div>
        </div>
           

        </>
    )
}

export default ScheduleLiveClass;