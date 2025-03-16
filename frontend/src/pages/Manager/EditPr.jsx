import React from "react";
import EditPriceForm from "../../components/manager/editprice";
import useAuth from "../../../function/useAuth";

const EditPr = () => {
    useAuth();
    return (
        <>
        <div>
            <EditPriceForm />

        </div>
        </>
    )
}

export default EditPr;