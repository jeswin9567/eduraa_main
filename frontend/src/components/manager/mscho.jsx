import React from "react";
import MVSHeader from "./mviewservicehead/mschohead";
import Managersidebrcom from "./sidebarmain/sidebarmain";
import ManScholarshipList from "./MScholarlist";
import useAuth from "../../../function/useAuth";
import "./mscho.css"; // Ensure this CSS file is created and linked.

function Mscholar() {
  useAuth();

  return (
    <>
      <div>
        <MVSHeader />
        <div className="mscholar-container">
          <Managersidebrcom />
          <ManScholarshipList />
        </div>
      </div>
    </>
  );
}

export default Mscholar;
