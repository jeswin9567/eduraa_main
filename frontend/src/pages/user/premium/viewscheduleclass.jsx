import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import UserViewScheduledClassesCom from "../../../components/user/premium/viewscheduleclscom";
import './userboxcrs.css'

const UserViewLiveTime = () => {
    return (
        <>
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <UserViewScheduledClassesCom />
            </div>
        </div>
        </>
    );
}

export default UserViewLiveTime;