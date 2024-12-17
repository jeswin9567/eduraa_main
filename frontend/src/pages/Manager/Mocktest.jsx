import React from "react";
import ManMockTestForm from "../../components/manager/addMock";
import useAuth from "../../../function/useAuth";
import MVEHeader from "../../components/manager/mviewservicehead/menhead";

const MockTest = () => {
    useAuth();
    return(
        <>
        <div>
            <MVEHeader />
            <ManMockTestForm />
        </div>
        </>
    )
}

export default MockTest;