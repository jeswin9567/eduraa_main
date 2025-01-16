import React from 'react'
import ManagerDashHead from '../../components/manager/mheads/mhomehead';
import Managersidebrcom from '../../components/manager/sidebarmain/sidebarmain';
import ViewReqTeacherDetails from '../../components/manager/Teacher/ViewTeacherDetails';
import './ViewTeacherId.css'

const ViewTeachID = () => {
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="viewteachidpage-container">
            <Managersidebrcom />
            <ViewReqTeacherDetails />
            </div>
        </div>
        </>
    );
}

export default ViewTeachID;