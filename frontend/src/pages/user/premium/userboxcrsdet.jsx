import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import UserSubtopicsListCom from "../../../components/user/premium/courses/viewcoursedeta";
import './userboxcrs.css'
import useAuth from "../../../../function/useAuth";


const CourseBoxDet = () => {
    useAuth();
    return (
        <>
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <UserSubtopicsListCom />  
            </div>
        </div>
        </>
    )
}
export default CourseBoxDet