import React from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import MProfile from "../../components/manager/mprofile";
import useAuth from "../../../function/useAuth";
import './Profile.css'

const ManagerProfile = () => {
    useAuth();
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="manprocontainerrrr-container">
            <Managersidebrcom />
            <MProfile />
            </div>
        </div>
        </>
    );
}

export default ManagerProfile;