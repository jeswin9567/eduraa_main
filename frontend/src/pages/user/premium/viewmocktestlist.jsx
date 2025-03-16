import React from "react";
import UserPremDHead from "../../../components/user/premium/heads/updhead";
import Usersidebrcom from "../../../components/user/premium/sidebar/usersidebar";
import UserPrmMocktestList from "../../../components/user/MocktestList";
import './userboxcrs.css'
import useAuth from "../../../../function/useAuth";

const ViewMockTestdetPage = () => {
    useAuth();
    return (
        <>
        <div>
            <UserPremDHead />
            <div className="Usrclasscomprm-container">
                <Usersidebrcom />
                <UserPrmMocktestList />
            </div>
        </div>
        </>
    );
}
export default ViewMockTestdetPage;