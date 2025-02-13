import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import StudentAnnouncementsCom from "../../../components/user/premium/announcement";
import './userboxcrs.css'

const ViewUsrAnnouncement = () => {
    return (
        <>
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <StudentAnnouncementsCom />
            </div>
        </div>
        </>
    )
}

export default ViewUsrAnnouncement