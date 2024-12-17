import React from "react";
import VManagerList from "../../components/admin/managemanager";
import ManageManHeader from "../../components/admin/managemanhead"; 
import Footer from "../../components/common/footer";


const ManageManager = () => {
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