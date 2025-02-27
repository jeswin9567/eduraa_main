import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import MockTestStatusBox from "../../components/teacher/dashboard/mocktestbox";
import ClassCountBox from "../../components/teacher/dashboard/uploadedCourseBox";
import LiveClassesBox from "../../components/teacher/dashboard/liveClass";
import TeacherAssignedStudentsCount from "../../components/teacher/dashboard/viewstudbox";
import TeacherRatingBox from "../../components/teacher/dashboard/teacherRating";
import TeacherCalendar from "../../components/teacher/dashboard/teacherCalendar";
import './teacherdashboard.css'


const TeacherDash = () => {
    return (
    <>
        <div>
            <TeacherDashHead />
            <div className="teacherdashbod-container">
            <Teachersidebrcom />
            <div className="teachermian-container">
            <MockTestStatusBox />
            <ClassCountBox />
            <LiveClassesBox />
            <TeacherRatingBox />
            <TeacherAssignedStudentsCount />
            <TeacherCalendar />
            </div>
            
            
            </div>
            

        </div>
    </>
    );
}
export default TeacherDash;