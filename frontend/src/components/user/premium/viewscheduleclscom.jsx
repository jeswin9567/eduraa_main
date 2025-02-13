import React, { useEffect, useState } from "react";
import axios from "axios";
import "./viewscheduleclscom.css"; // Import CSS file
import { useNavigate } from "react-router-dom";

const UserViewScheduledClassesCom = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail"); // Get email from localStorage

  useEffect(() => {
    if (!userEmail) {
      setError("User email not found in localStorage");
      setLoading(false);
      return;
    }
  
    axios
      .get(`http://localhost:5000/api/liveclass/user/scheduled-classes?email=${userEmail}`)
      .then((response) => {
        if (response.data.message === "No scheduled classes available") {
          setClasses([]);
        } else {
          setClasses(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching scheduled classes");
        setLoading(false);
      });
  }, [userEmail]);

  const joinClass = (classId) => {
    navigate(`/video-call/${classId}`);
  };

  return (
    <div className="viewusersheduleclz">
      <h2>Scheduled Classes</h2>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && classes.length === 0 && <p className="no-classes">No scheduled classes available.</p>}

      {!loading && !error && classes.length > 0 && (
        <table className="class-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Date</th>
              <th>Time</th>
              <th>Teacher</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((liveClass) => (
              <tr key={liveClass._id}>
                <td>{liveClass.topic}</td>
                <td>{new Date(liveClass.date).toLocaleDateString()}</td>
                <td>{liveClass.time}</td>
                <td>{liveClass.teacherName}</td>
                <td>{liveClass.teacherEmail}</td>
                <td>
                  {liveClass.status && (
                    <button 
                      className="join-button"
                      onClick={() => joinClass(liveClass._id)}
                    >
                      Join
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserViewScheduledClassesCom;
