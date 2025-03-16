import React from "react";
import TeacherDashHead from "../../components/teacher/heads/teacherhomehead";
import Teachersidebrcom from "../../components/teacher/sidebar/teachersidebarcom";
import TeacherAnnouncementsCom from "../../components/teacher/viewannouncement";
import './uploadedClasseslistsTopic.css'
import useAuth from "../../function/useAuth";

const ViewTeachAnnouncement = () => {
    useAuth();
    return (
        <>
        <div>
            <TeacherDashHead />
            <div className="listclassastopic-container">
                <Teachersidebrcom />
                <TeacherAnnouncementsCom />
            </div>  
        </div>
        </>
    )
};

export default ViewTeachAnnouncement;