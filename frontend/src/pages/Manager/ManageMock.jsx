import React from "react";
import MVEHeader from "../../components/manager/mviewservicehead/menhead";
import MockEntranceExamList from "../../components/manager/MockVEntr";
import Footer from "../../components/common/footer";
import useAuth from "../../../function/useAuth";

const ManageMock = () => {
    useAuth();
    return (
        <>
        <div>
            <MVEHeader />
            <MockEntranceExamList/>
            <Footer />
        </div>
        </>
    )
}

export default ManageMock;