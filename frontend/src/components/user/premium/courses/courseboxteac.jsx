import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "./courseboxteac.css"; // Import the CSS file

const SubjectBoxom = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/course/teachers/subjects")
      .then((response) => {
        const subjectList = response.data
          .map((teacher) => teacher.subjectassigned)
          .filter((subject) => subject); // Remove empty values
        setSubjects(subjectList);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching subjects");
        setLoading(false);
      });
  }, []);

  return (
    <div className="classheaduserprm-container">
      <h2 className="classheaduserprm-title">Classes</h2>

      {loading && <p className="classheaduserprm-loading">Loading...</p>}
      {error && <p className="classheaduserprm-error">{error}</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="classheaduserprm-empty">No subjects assigned yet.</p>
      )}

      {!loading && !error && subjects.length > 0 && (
        <div className="classheaduserprm-grid">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="classheaduserprm-card"
              onClick={() => navigate(`/available-courses/${encodeURIComponent(subject)}`)} // Pass subject in URL
            >
              <h3 className="classheaduserprm-topic">{subject}</h3>
              <p className="classheaduserprm-count">Click to view available courses</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectBoxom;
