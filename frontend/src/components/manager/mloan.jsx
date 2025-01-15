import React from "react";
import MVLHeader from "./mviewservicehead/mloanhead";
import Managersidebrcom from "./sidebarmain/sidebarmain";
import MLoanList from "./MLoanlist";
import './mloan.css'
import useAuth from "../../../function/useAuth";

function Mloan() {

  useAuth();


  return (
    <>  
      <div>
        <MVLHeader />
        <div className="mloann-container">
        <Managersidebrcom />
        <MLoanList /></div>
        
      </div>
    </>
  );    
}

export default Mloan;
