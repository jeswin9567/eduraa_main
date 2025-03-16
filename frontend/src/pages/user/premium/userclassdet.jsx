import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import UserClassDetail from "../../../components/user/premium/courses/viewclasses";
import './userboxcrs.css'
import useAuth from "../../../../function/useAuth";

const UserClasPartic = () =>{
    useAuth();
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