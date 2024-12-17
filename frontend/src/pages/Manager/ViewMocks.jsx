import React from "react";
import MockTestList from "../../components/manager/ViewMockTest";
import MVEHeader from "../../components/manager/mviewservicehead/menhead";
import Footer from "../../components/common/footer";
import useAuth from "../../../function/useAuth";

const ViewMock = () => {
    useAuth();
    return (
        <>
        <div>
            <MVEHeader />
            <MockTestList />
            <Footer />
        </div>
        </>
    )
}

export default ViewMock;