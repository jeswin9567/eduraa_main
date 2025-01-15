import React from "react";
import MVEHeader from "../../components/manager/mviewservicehead/menhead";
import MockEntranceExamList from "../../components/manager/MockVEntr";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import './ManageMock.css'
import useAuth from "../../../function/useAuth";

const ManageMock = () => {
    useAuth();
    return (
        <>
        <div>
            <MVEHeader />
            <div className="managersidemocktest-container">
            <Managersidebrcom/>
            <MockEntranceExamList/></div> 
        </div>
        </>
    )
}

export default ManageMock;