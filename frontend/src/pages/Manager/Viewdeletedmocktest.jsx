import React from "react";
import MVEHeader from "../../components/manager/mviewservicehead/menhead";
import DeletedMockTests from "../../components/manager/deletedmocktest";
import useAuth from "../../../function/useAuth";

const VDeletedMockTest = () => {
    useAuth();
    return (
        <>
        <div>
            <MVEHeader />
            <DeletedMockTests />

        </div>
        </>
    )
}

export default VDeletedMockTest;