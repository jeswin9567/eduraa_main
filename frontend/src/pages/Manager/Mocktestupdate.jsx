import React from "react";
import UpdateMockTest from "../../components/manager/mocktestup";
import useAuth from "../../../function/useAuth";

const UpdateMock = () => {
    useAuth();
    return (
        <>
        <div>
            <UpdateMockTest />
        </div>
        </>
    )
}

export default UpdateMock