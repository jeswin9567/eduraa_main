import React from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import UpdateFieldCourses from "../../components/manager/updatefield";
import './addfield.css'

const UpdFieldPg = () => {
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="entrfieldpg-container">
                <Managersidebrcom />
                <UpdateFieldCourses />
            </div>
        </div>
        </>
    )
}

export default UpdFieldPg