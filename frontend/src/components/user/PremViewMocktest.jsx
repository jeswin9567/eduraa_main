import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../user/premium/courses/courseboxteac.css";

const PremViewMocktest = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/course/teachers/subjects")
      .then((response) => {
        setSubjects(response.data); // Now directly setting unique subjects
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching subjects");
        setLoading(false);
      });
  }, []);

  const handleSubjectClick = (subject) => {
    navigate(`/mocktest-list/${encodeURIComponent(subject)}`);
  };

  return (
    <div className="classheaduserprm-container">
      <h2 className="classheaduserprm-title">MockTest</h2>

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
              onClick={() => handleSubjectClick(subject)}
            >
              <h3 className="classheaduserprm-topic">{subject}</h3>
              <p className="classheaduserprm-count">Click to view available mocktest</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremViewMocktest;
