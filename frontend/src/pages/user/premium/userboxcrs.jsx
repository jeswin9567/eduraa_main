import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import UVClassCom from "../../../components/user/premium/courses/viewusercoursebox";
import './userboxcrs.css'

const UserPrmCousrBx = () => {
    return (
        <>
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <UVClassCom />
            </div>
        </div>
        </>
    )
}

export default UserPrmCousrBx;