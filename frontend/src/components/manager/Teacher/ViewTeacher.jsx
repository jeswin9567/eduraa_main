import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewTeacher.css";

const ViewTeacherCom = () => {
  const [teachers, setTeachers] = useState([]);
  const [modalTeacher, setModalTeacher] = useState(null);
  const [showExamTypeModal, setShowExamTypeModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedExamTypes, setSelectedExamTypes] = useState([]);
  const [examTypeOptions, setExamTypeOptions] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/viewteachers/teachers");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchExamTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/viewentr");
        const uniqueExamTypes = [...new Set(response.data.map(entrance => entrance.examType))];
        setExamTypeOptions(uniqueExamTypes);
      } catch (error) {
        console.error("Error fetching exam types:", error);
      }
    };

    fetchTeachers();
    fetchExamTypes();
  }, []);

  const openModal = (teacher) => {
    setModalTeacher(teacher);
  };

  const closeModal = () => {
    setModalTeacher(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/viewteachers/viewteachers/${newStatus ? "activate" : "disable"}/${id}`
      );
      alert(`Teacher has been ${newStatus ? "activated" : "disabled"} successfully!`);
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === id ? { ...teacher, status: newStatus } : teacher
        )
      );
      
    } catch (error) {
      console.error(`Error ${newStatus ? "activating" : "disabling"} teacher:`, error);
      alert(`Failed to ${newStatus ? "activate" : "disable"} teacher. Please try again.`);
    }
  };

  const handleExamTypeClick = (teacher) => {
    setSelectedTeacher(teacher);
    setSelectedExamTypes(teacher.examTypes || []);
    setShowExamTypeModal(true);
  };

  const handleExamTypeToggle = (examType) => {
    setSelectedExamTypes(prev => 
      prev.includes(examType)
        ? prev.filter(type => type !== examType)
        : [...prev, examType]
    );
  };

  const handleExamTypeSubmit = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/viewteachers/update-exam-types/${selectedTeacher._id}`,
        { examTypes: selectedExamTypes }
      );
      
      // Update local state
      setTeachers(teachers.map(teacher => 
        teacher._id === selectedTeacher._id
          ? { ...teacher, examTypes: selectedExamTypes }
          : teacher
      ));
      
      setShowExamTypeModal(false);
      alert('Exam types updated successfully!');
    } catch (error) {
      console.error('Error updating exam types:', error);
      alert('Failed to update exam types');
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
                <strong>Subjects:</strong> {teacher.subjectassigned}
              </p>
              <button
                className="manteachervie-toggle-details"
                onClick={() => openModal(teacher)}
              >
                View Details
              </button>
              <button
                className={`manteachervie-${teacher.status ? "disable" : "activate"}-button`}
                onClick={() => handleStatusChange(teacher._id, !teacher.status)}
              >
                {teacher.status ? "Disable" : "Activate"}
              </button>
              <button
                className="manteachervie-entrance-button"
                onClick={() => handleExamTypeClick(teacher)}
              >
                Entrance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Updated Exam Type Modal */}
      {showExamTypeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Exam Types</h3>
            <div className="exam-type-options">
              {examTypeOptions.map(examType => (
                <label key={examType} className="exam-type-option">
                  <input
                    type="checkbox"
                    checked={selectedExamTypes.includes(examType)}
                    onChange={() => handleExamTypeToggle(examType)}
                  />
                  {examType}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={handleExamTypeSubmit}>Save</button>
              <button onClick={() => setShowExamTypeModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

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
