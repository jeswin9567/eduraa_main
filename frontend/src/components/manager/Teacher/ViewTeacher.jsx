import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewTeacher.css";

const ViewTeacherCom = () => {
  const [teachers, setTeachers] = useState([]);
  const [modalTeacher, setModalTeacher] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/viewteachers/teachers");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const openModal = (teacher) => {
    setModalTeacher(teacher);
  };

  const closeModal = () => {
    setModalTeacher(null);
  };

  const handleDisable = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/viewteachers/viewteachers/disable/${id}`);
      alert("Teacher has been disabled successfully!");
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === id ? { ...teacher, active: false } : teacher
        )
      );
    } catch (error) {
      console.error("Error disabling teacher:", error);
      alert("Failed to disable teacher. Please try again.");
    }
  };

  return (
    <div className="manteachervie-container">
      <h2 className="manteachervie-page-title">Teacher Profiles</h2>
      <div className="manteachervie-teacher-grid">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="manteachervie-teacher-card">
            <div className="manteachervie-teacher-photo">
              <p>
                <a href={teacher.photo} target="_blank" rel="noopener noreferrer">
                  <img
                    src={teacher.photo}
                    alt={`${teacher.firstname} ${teacher.lastname}`}
                    className="teacher-photo-thumbnail"
                  />
                </a>
              </p>
            </div>

            <div className="manteachervie-teacher-summary">
              <h3>
                {teacher.firstname} {teacher.lastname}
              </h3>
              <p>
                <strong>Email:</strong> {teacher.email}
              </p>
              <p>
                <strong>Phone:</strong> {teacher.phone}
              </p>
              <p>
                <strong>Subjects:</strong> {teacher.subjects}
              </p>
              <button
                className="manteachervie-toggle-details"
                onClick={() => openModal(teacher)}
              >
                View Details
              </button>
              <button
                className="manteachervie-disable-button"
                onClick={() => handleDisable(teacher._id)}
                disabled={!teacher.active} // Disable button if already inactive
              >
                Disable
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalTeacher && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <h3>
              {modalTeacher.firstname} {modalTeacher.lastname}
            </h3>
            <p>
              <strong>Alternate Phone:</strong> {modalTeacher.altPhone}
            </p>
            <p>
              <strong>Gender:</strong> {modalTeacher.gender}
            </p>
            <p>
              <strong>Address:</strong> {modalTeacher.address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(modalTeacher.dateofbirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Qualification:</strong> {modalTeacher.qualification}
            </p>
            <p>
              <strong>Specialization:</strong> {modalTeacher.specialization}
            </p>
            <p>
              <strong>Experience:</strong> {modalTeacher.experience}
            </p>
            <div className="manteachervie-teacher-documents">
              <p>
                <strong>ID Card:</strong>{" "}
                <a
                  href={modalTeacher.idCard}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </p>
              <p>
                <strong>Degree Certificate:</strong>{" "}
                <a
                  href={modalTeacher.degreeCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </p>
              <p>
                <strong>Experience Certificate:</strong>{" "}
                <a
                  href={modalTeacher.experienceCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </p>
              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={modalTeacher.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTeacherCom;
