import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './ViewTeacherrequest.css'   

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    // Fetch all teacher details
    axios
      .get("http://localhost:5000/api/viewteachers/teachersreq") // Replace with your API endpoint
      .then((response) => setTeachers(response.data))
      .catch((error) => console.error("Error fetching teachers:", error));
  }, []);

  return (
    <div className="viewteacherreqst-container">
      <h2 className="viewteacherreqst-heading">Teacher List</h2>
      <div className="viewteacherreqst-grid">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="viewteacherreqst-card">
            <div className="viewteacherreqst-photo">
              <img
                src={teacher.photo}
                alt={`${teacher.firstname} ${teacher.lastname}`}
                className="viewteacherreqst-photo-img"
              />
            </div>
            <h3 className="viewteacherreqst-name">
              {teacher.firstname} {teacher.lastname}
            </h3>
            <p className="viewteacherreqst-detail">
              <strong>Email:</strong> {teacher.email}
            </p>
            <p className="viewteacherreqst-detail">
              <strong>Phone:</strong> {teacher.phone}
            </p>
            <p className="viewteacherreqst-detail">
              <strong>Specialization:</strong> {teacher.specialization}
            </p>
            <p className="viewteacherreqst-detail">
              <strong>Experience:</strong> {teacher.experience} years
            </p>
            <div className="viewteacherreqst-action">
              <Link
                to={`/manager/viewteacherdetails/${teacher._id}`}
                className="viewteacherreqst-button"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherList;
