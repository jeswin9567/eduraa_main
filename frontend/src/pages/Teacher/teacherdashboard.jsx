import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import MockTestStatusBox from "../../components/teacher/dashboard/mocktestbox";
import ClassCountBox from "../../components/teacher/dashboard/uploadedCourseBox";
import LiveClassesBox from "../../components/teacher/dashboard/liveClass";
import './teacherdashboard.css'


const TeacherDash = () => {
    return (
    <>
        <div>
            <TeacherDashHead />
            <div className="teacherdashbod-container">
            <Teachersidebrcom />
            <MockTestStatusBox />
            <ClassCountBox />
            <LiveClassesBox />
            
            </div>
            

        </div>
    </>
    );
}
export default TeacherDash;