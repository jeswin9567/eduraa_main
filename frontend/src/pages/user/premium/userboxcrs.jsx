import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import UVClassCom from "../../../components/user/premium/courses/viewusercoursebox";
import './userboxcrs.css'
import useAuth from "../../../function/useAuth";

const UserPrmCousrBx = () => {
    useAuth();
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