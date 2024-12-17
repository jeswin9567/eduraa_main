import React from "react";
import ManSerHeader from "../../components/manager/mheads/mehead";
import MProfile from "../../components/manager/mprofile";
import Footer from "../../components/common/footer";
import useAuth from "../../../function/useAuth";

const ManagerProfile = () => {
    useAuth();
    return (
        <>
        <div>
            <ManSerHeader />
            <MProfile />
            <Footer />
        </div>
        </>
    );
}

export default ManagerProfile;