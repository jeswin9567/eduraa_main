import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./Requestcomp.css";

const ActiveTeacherBox = () => {
  const [activeTeachersCount, setActiveTeachersCount] = useState(0);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    const fetchActiveTeachers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/viewteachers/active-teachers`);
        const activeTeachers = response.data.filter((teacher) => teacher.active);
        setActiveTeachersCount(activeTeachers.length);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchActiveTeachers();
  }, []);

  const handleClick = () => {
    navigate("/manager/viewteacher");  // Navigate to the desired page on click
  };

  return (
    <div className="managerdashrequestbox-container" onClick={handleClick}> {/* Add onClick handler */}
      <div className="managerdashrequestbox-inner">
        <h3 className="managerdashrequestbox-title">Teachers</h3>
        <p className="managerdashrequestbox-count">{activeTeachersCount}</p>
        <p className="managerdashrequestbox-subtitle">Active Teachers</p>
      </div>
    </div>
  );
};

export default ActiveTeacherBox;
