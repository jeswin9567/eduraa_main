import React from "react";
import ManagerDashHead from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import PriceTable from "../../components/manager/viewprice";
import './ViewPrice.css'


const ViewPrices = () => {
    return (
        <>
        <div>
            <ManagerDashHead />
            <div className="manviewpricelist-container">
                <Managersidebrcom />
            <PriceTable />
            </div>
        </div>
        </>
    )
}

export default ViewPrices;