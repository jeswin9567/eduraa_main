import React from "react";
import ManPriHeader from "../../components/manager/mheads/mpricehead";
import PriceTable from "../../components/manager/viewprice";
import Footer from "../../components/common/footer";

const ViewPrices = () => {
    return (
        <>
        <div>
            <ManPriHeader />
            <PriceTable />
            <Footer />
        </div>
        </>
    )
}

export default ViewPrices;