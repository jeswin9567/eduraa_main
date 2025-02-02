import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import './dashbd.css'

const UserPrmDashBrd = () => {
    return (
        <>
            <UserPremDHead/>
            <div className="userdashbbprm-containerrr">
                <Usersidebrcom />
            </div>
        </>
    )
};
export default UserPrmDashBrd;