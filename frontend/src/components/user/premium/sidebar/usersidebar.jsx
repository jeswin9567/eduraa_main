import React from "react";
import "./usersidebar.css";
import { useNavigate } from "react-router-dom";

const Usersidebrcom = () => {
  const navigate = useNavigate();

  return (
    <div className="uusersidebar">
      <div className="uusersidebarbtns">
        <button onClick={() => navigate("/userhome")}>Home</button>
        <button onClick={() => navigate('/user/premium/classes')}>Courses</button>
        <button>Mocktest</button>
        <button onClick={() => navigate('/student/classschedule')}>Class Schedules</button>
        <button>Live Classes</button>
        <button onClick={() => navigate('/student/assignedteachers')}>Teachers</button>
        <button>Announcement</button>
      </div>
    </div>
  );
};

export default Usersidebrcom;
