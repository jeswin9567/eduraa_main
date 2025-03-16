import React, { useRef } from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import AddPaymentOption from "../../components/manager/addprice";
import './Amount.css'
import useAuth from "../../../function/useAuth";

const Amount = () => {
    useAuth();
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="priceaddman-container">
                <Managersidebrcom />
                <AddPaymentOption />
            </div>
        </div>
        </>
    );
}

export default Amount;
