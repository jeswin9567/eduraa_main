import React from "react";
import './ViewTeach.css'
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import ViewTeacherCom from "../../components/manager/Teacher/ViewTeacher";
import useAuth from "../../function/useAuth";

const ViewTeacher = () => {
    useAuth();
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="vt-container">
            <Managersidebrcom />
            <ViewTeacherCom /></div>
        </div>
        </>
    );
}

export default ViewTeacher;