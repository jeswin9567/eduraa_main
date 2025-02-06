import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./viewstudbox.css"; // Import the CSS file

const TeacherAssignedStudentsCount = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          setError("User email not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/viewassign/assigned-students/count?email=${userEmail}`
        );

        setStudentCount(response.data.studentCount);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch student count.");
        setLoading(false);
      }
    };

    fetchStudentCount();
  }, []);

  const handleBoxClick = () => {
    navigate("/teacher/assignedstudents"); // Replace with your actual route
  };

  return (
    <div className="assigned-students-box" onClick={handleBoxClick}>
      <h2>Assigned Students</h2>
      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <p className="student-count">{studentCount}</p>
      )}
    </div>
  );
};

export default TeacherAssignedStudentsCount;
