import React from "react";
import "./usersidebar.css";
import { useNavigate } from "react-router-dom";

const Usersidebrcom = () => {
  const navigate = useNavigate();

  return (
    <div className="uusersidebar">
      <div className="uusersidebarbtns">
        <button onClick={() => navigate("/teacherhome")}>Home</button>
        <button>Students</button>
        <button>Announcements</button>
      </div>
    </div>
  );
};

export default Usersidebrcom;
