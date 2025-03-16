import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate, FaEnvelope, FaPhone, FaStar, FaBookReader, FaClock } from 'react-icons/fa';
import './ViewTeacherrequest.css';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/viewteachers/teachersreq");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="teacher-request-loading">
        <div className="loading-spinner"></div>
        <p>Loading teacher requests...</p>
      </div>
    );
  }

  return (
    <div className="teacher-request-container">
      <div className="teacher-request-header">
        <FaUserGraduate className="header-icon" />
        <div className="header-text">
          <h2>Teacher Applications</h2>
          <p>Review and manage new teacher requests</p>
        </div>
      </div>

      <div className="teacher-request-grid">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="teacher-request-card">
            <div className="teacher-card-header">
              <div className="teacher-image-container">
                <img
                  src={teacher.photo}
                  alt={`${teacher.firstname} ${teacher.lastname}`}
                  className="teacher-photo"
                />
                <div className="status-badge">New</div>
              </div>
              <h3>{teacher.firstname} {teacher.lastname}</h3>
              <p className="teacher-specialization">{teacher.specialization}</p>
            </div>

            <div className="teacher-card-details">
              <div className="detail-row">
                <FaEnvelope className="detail-icon" />
                <span>{teacher.email}</span>
              </div>
              <div className="detail-row">
                <FaPhone className="detail-icon" />
                <span>{teacher.phone}</span>
              </div>
              <div className="detail-row">
                <FaBookReader className="detail-icon" />
                <span>{teacher.subjects}</span>
              </div>
              <div className="detail-row">
                <FaClock className="detail-icon" />
                <span>{teacher.experience} years experience</span>
              </div>
              <div className="detail-row">
                <FaStar className="detail-icon" />
                <span>{teacher.qualification}</span>
              </div>
            </div>

            <Link
              to={`/manager/viewteacherdetails/${teacher._id}`}
              className="view-details-button"
            >
              Review Application
            </Link>
          </div>
        ))}
      </div>

      {teachers.length === 0 && (
        <div className="no-requests">
          <FaUserGraduate className="no-requests-icon" />
          <h3>No Pending Requests</h3>
          <p>There are no new teacher applications to review at this time.</p>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
