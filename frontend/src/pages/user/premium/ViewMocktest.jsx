import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import PremViewMocktest from "../../../components/user/PremViewMocktest";
import './userboxcrs.css'
import useAuth from "../../../../function/useAuth";

const PremiumViewMocktest = () => {
    useAuth();
    return (
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <PremViewMocktest />
            </div>
        </div>
    );
};

export default PremiumViewMocktest;

