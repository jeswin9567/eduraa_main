import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './ViewTeacherDetails.css';

const ViewReqTeacherDetails = () => {
  const { id } = useParams(); // Get the teacher ID from the URL
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [subject, setSubject] = useState(""); // State for selected subject

  useEffect(() => {
    // Fetch teacher details by ID
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/viewteachers/viewteacherdet/${id}`)
      .then((response) => setTeacher(response.data))
      .catch((error) => console.error("Error fetching teacher details:", error));
  }, [id]);

  const handleAccept = () => {
    if (!subject) {
      alert("Please select a subject before accepting.");
      return;
    }
  
    axios
      .patch(`${import.meta.env.VITE_API_URL}/api/viewteachers/teacheraccept/${id}`, {
        active: true,
        subjectassigned: subject,
      })
      .then((response) => {
        alert("Teacher accepted successfully! Email sent.");
        navigate("/mhome");
      })
      .catch((error) => {
        console.error("Error updating teacher status:", error);
        alert("Failed to accept the teacher. Please try again.");
      });
  };
  

  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/viewteachers/teacherreject/${id}`)
      .then(() => {
        alert("Teacher deleted!");
        navigate("/teachers");
      })
      .catch((error) => console.error("Error deleting teacher:", error));
  };

  if (!teacher) return <p>Loading...</p>;

  return (
    <div className="viewteacherid-container">
      <div className="viewteacherid-card">
        <div className="viewteacherid-header">
          <a href={teacher.photo} target="_blank" rel="noopener noreferrer">
            <img
              src={teacher.photo}
              alt={`${teacher.firstname} ${teacher.lastname}`}
              className="viewteacherid-photo"
            />
          </a>
          <h2>
            {teacher.firstname} {teacher.lastname}
          </h2>
          <p className="viewteacherid-email">{teacher.email}</p>
        </div>

        <div className="viewteacherid-body">
          <p>
            <strong>Phone:</strong> {teacher.phone}
          </p>
          <p>
            <strong>Alternate Phone:</strong> {teacher.altPhone}
          </p>
          <p>
            <strong>Gender:</strong> {teacher.gender}
          </p>
          <p>
            <strong>Address:</strong> {teacher.address}
          </p>
          <p>
            <strong>Subjects:</strong> {teacher.subjects}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(teacher.dateofbirth).toLocaleDateString()}
          </p>
          <p>
            <strong>Qualification:</strong> {teacher.qualification}
          </p>
          <p>
            <strong>Specialization:</strong> {teacher.specialization}
          </p>
          <p>
            <strong>Experience:</strong> {teacher.experience} years
          </p>
          <p>
            <strong>Active:</strong> {teacher.active ? "Yes" : "No"}
          </p>
        </div>

        <div className="viewteacherid-documents">
          <h3>Documents</h3>
          <p>
            <strong>ID Card:</strong>{" "}
            <a href={teacher.idCard} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </p>
          <p>
            <strong>Degree Certificate:</strong>{" "}
            <a
              href={teacher.degreeCertificate}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </p>
          <p>
            <strong>Experience Certificate:</strong>{" "}
            <a
              href={teacher.experienceCertificate}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </p>
          <p>
            <strong>Resume:</strong>{" "}
            <a href={teacher.resume} target="_blank" rel="noopener noreferrer">
              View
            </a>
          </p>
        </div>

        <div className="viewteacherid-actions">
          <label htmlFor="subject-select">Assign Subject:</label>
          <select
            id="subject-select"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="" disabled>
              Select a Subject
            </option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="English">English</option>
            <option value="Computer Science">Computer Science</option>
          </select>

          <button className="viewteacherid-accept" onClick={handleAccept}>
            Accept
          </button>
          <button className="viewteacherid-delete" onClick={handleDelete}>
            Reject/Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReqTeacherDetails;
