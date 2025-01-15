import React from "react";
import ManHomHeader from "../../components/manager/mheads/mhomehead";
import Managersidebrcom from "../../components/manager/sidebarmain/sidebarmain";
import useAuth from "../../../function/useAuth";

function Mhome()
{

    useAuth();


    return(
        <>
        <div>
            <ManHomHeader />
            <Managersidebrcom />
        </div>
        </>
    );
}

export default Mhome;