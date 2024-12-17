import React from "react";
import MVEHeader from "../../components/manager/mviewservicehead/menhead";
import ViewMockTestDetails from "../../components/manager/Viewmocktestdetails";
import Footer from "../../components/common/footer";
import useAuth from "../../../function/useAuth";

const VMockTestDet = () => {
    useAuth();
    return(
        <>
        <div>
            <MVEHeader />
            <ViewMockTestDetails />
            <Footer />

        </div>
        </>
    );
}

export default VMockTestDet;