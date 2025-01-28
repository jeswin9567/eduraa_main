import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import LiveClassListCom from "../../components/teacher/courses/viewliveClassAllComp";
import './viewscheduleliveclassAll.css'


const ViewAllSchedLiveClz = () => {
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="viewAllSchedli-container">
                <Teachersidebrcom />
                <LiveClassListCom />

            </div>
        </div>
        
        </>
    );

}
export default ViewAllSchedLiveClz