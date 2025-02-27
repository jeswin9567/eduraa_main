import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import ViewAssignedTeacherCount from "../../../components/user/premium/viewteachercount";
import './dashbd.css'

const UserPrmDashBrd = () => {
    return (
        <>
            <UserPremDHead/>
            <div className="userdashbbprm-containerrr">
                <Usersidebrcom />
                <ViewAssignedTeacherCount />
                
            </div>
        </>
    )
};
export default UserPrmDashBrd;