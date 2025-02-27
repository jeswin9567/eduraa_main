import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './viewteachercount.css';

const ViewAssignedTeacherCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchTeacherCount = async () => {
      if (!email) {
        console.error("No email found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/user/assigned-teacher-count?email=${email}`);
        setCount(response.data.assignedTeacherCount);
      } catch (error) {
        console.error("Error fetching assigned teacher count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCount();
  }, [email]);

  return (
    <div 
      className="viewteachcnt" 
      onClick={() => navigate("/student/assignedteachers")} // Change '/target-page' to your actual route
      style={{ cursor: "pointer" }}
    >
      <div className="viewteachcnt-inner">
        <div className="viewteachcnt-title">Assigned Teachers</div>
        <div className="viewteachcnt-count">
          {loading ? "Loading..." : count}
        </div>
        <div className="viewteachcnt-subtitle">Click to View More</div>
      </div>
    </div>
  );
};

export default ViewAssignedTeacherCount;
