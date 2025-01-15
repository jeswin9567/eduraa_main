import React from "react";
import MVEHeader from "./mviewservicehead/menhead";
import Managersidebrcom from "./sidebarmain/sidebarmain";
import MEntranceList from "./MEntrancelist";

import './mentran.css';
import useAuth from "../../../function/useAuth";

function MEntrance() {
    useAuth();

    return (
        <>
            <div>
                <MVEHeader />
                <div className="mentrcnnn-container">
                < Managersidebrcom />
                <MEntranceList /></div>
            </div>
        </>
    );
}

export default MEntrance