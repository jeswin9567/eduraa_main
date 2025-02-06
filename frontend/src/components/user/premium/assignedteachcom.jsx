import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../teacher/viewassignedstucom.css";  // Import the external CSS file

const StudentAssignedTeachersCom = () => {
  const [teacher, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignedTeachers = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          setError("User email not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/viewassign/assigned-teachers?email=${userEmail}`
        );

        setTeachers(response.data.assignedTeacher);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Teachers.");
        setLoading(false);
      }
    };

    fetchAssignedTeachers();
  }, []);

  return (
    <div className="teacherviewstudnt">
      <h2>Assigned Teachers</h2>
      {loading ? (
        <div className="loading">Loading Teachers...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : teacher.length > 0 ? (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {teacher.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.firstname}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.subjectassigned || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-students">No assigned Teachers found.</div>
      )}
    </div>
  );
};

export default StudentAssignedTeachersCom;
