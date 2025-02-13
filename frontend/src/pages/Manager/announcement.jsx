import React from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import AnnouncementsCom from "../../components/manager/announcement";
import './announcement.css'

const ManagerAnnouncementMake = () => {
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="announcemntpg-container">
                <Managersidebrcom />
                <AnnouncementsCom />
            </div>
        </div>
        </>
    )
}

export default ManagerAnnouncementMake;