import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./Requestcomp.css";

const ManagerDashRequestBox = () => {
  const [inactiveTeachersCount, setInactiveTeachersCount] = useState(0);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const fetchInactiveTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/viewteachers/inactive-teachers");
        const inactiveTeachers = response.data.filter((teacher) => !teacher.active);
        setInactiveTeachersCount(inactiveTeachers.length);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchInactiveTeachers();
  }, []);

  const handleClick = () => {
    navigate("/manager/viewteacherrequests");  // Navigate to the desired page on click
  };

  return (
    <div className="managerdashrequestbox-container" onClick={handleClick}> {/* Add onClick handler */}
      <div className="managerdashrequestbox-inner">
        <h3 className="managerdashrequestbox-title">Teacher Requests</h3>
        <p className="managerdashrequestbox-count">{inactiveTeachersCount}</p>
        <p className="managerdashrequestbox-subtitle">Pending Approvals</p>
      </div>
    </div>
  );
};

export default ManagerDashRequestBox;
