import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./viewassignedstucom.css";  // Import the external CSS file

const TeacherAssignedStudentsCom = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          setError("User email not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/viewassign/assigned-students?email=${userEmail}`
        );

        setStudents(response.data.assignedStudents);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch students.");
        setLoading(false);
      }
    };

    fetchAssignedStudents();
  }, []);

  const handleViewProgress = (studentEmail) => {
    navigate(`/teacher/student-progress/${studentEmail}`);
  };

  return (
    <div className="teacherviewstudnt">
      <h2>Assigned Students</h2>
      {loading ? (
        <div className="loading">Loading students...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : students.length > 0 ? (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Education</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.education || "N/A"}</td>
                  <td>
                    <button 
                      className="progress-btn"
                      onClick={() => handleViewProgress(student.email)}
                    >
                      View Progress
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-students">No assigned students found.</div>
      )}
    </div>
  );
};

export default TeacherAssignedStudentsCom;
