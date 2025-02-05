import React from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import AddFieldCourses from "../../components/manager/addfield";
import './addfield.css'

const EntrFieldPage = () => {
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="entrfieldpg-container">
                <Managersidebrcom />
                <AddFieldCourses />
            </div>

        </div>
        </>
    );
}

export default EntrFieldPage;