import React from "react";
import MockTestList from "../../components/manager/ViewMockTest";
import MVEHeader from "../../components/manager/mviewservicehead/menhead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import useAuth from "../../../function/useAuth";
import './ViewMock.css';

const ViewMock = () => {
    useAuth();
    return (
        <>
        <div>
            <MVEHeader />
            <div className="viewmocktestsidebar-container">
            <Managersidebrcom />
            <MockTestList />
            
            </div>

        </div>
        </>
    )
}

export default ViewMock;