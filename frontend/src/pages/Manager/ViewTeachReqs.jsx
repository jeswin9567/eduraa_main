import React from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import TeacherList from "../../components/manager/Teacher/ViewTeacherrequest";
import './ViewTeachReq.css'
import useAuth from "../../../function/useAuth";

const ViewTeachReq = () => {
    useAuth();
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="viewteachreqpage-container">
            <Managersidebrcom />
            <TeacherList />
            </div>

        </div>
        </>
    );

}
export default ViewTeachReq;