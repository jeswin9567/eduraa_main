import React from "react";
import VManagerList from "../../components/admin/managemanager";
import ManageManHeader from "../../components/admin/managemanhead"; 
import Footer from "../../components/common/footer";
import useAuth from "../../function/useAuth";

const ManageManager = () => {
    useAuth();
    return (
        <>
        <div>
            <ManageManHeader />
            <VManagerList />
            <Footer />

        </div>
        </>
    )
}

export default ManageManager;