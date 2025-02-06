import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import StudentAssignedTeachersCom from "../../../components/user/premium/assignedteachcom";
import './userboxcrs.css'

const ViewAssignTeah = () =>{
    return(
        <>
        <UserPremDHead />
        <div className="Usrclasscomprm-container">
            <Usersidebrcom />
            <StudentAssignedTeachersCom />

        </div>
        </>
    );
}

export default ViewAssignTeah