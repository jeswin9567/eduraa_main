import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import UserClassDetail from "../../../components/user/premium/courses/viewclasses";
import './userboxcrs.css'

const UserClasPartic = () =>{
    return(
        <>
            <div>
                <UserPremDHead />
                <div className="Usrclasscomprm-container">
                    <Usersidebrcom />
                    <UserClassDetail />
                </div>
            </div>
        </>
    );
}

export default UserClasPartic