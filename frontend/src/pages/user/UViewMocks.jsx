import React from "react";
import UMockHeader from "../../components/user/vheads/mockhead";
import UMockTestList from "../../components/user/UViewMocktests";
import Footer from "../../components/common/footer";
import useAuth from "../../../function/useAuth";

const UEachMock = () => {
    useAuth();
    return (
        <>
        <div>
            <UMockHeader />
            <UMockTestList />
            <Footer />

        </div>
        </>
    )
}

export default UEachMock;