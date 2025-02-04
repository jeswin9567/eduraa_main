import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import SubjectBoxom from "../../../components/user/premium/courses/courseboxteac";
import './userboxcrs.css'


const Course = () => {
    return (
        <>
        <div>
            <UserPremDHead/>
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <SubjectBoxom />
            </div>
        </div>
        </>
    )
}

export default Course;