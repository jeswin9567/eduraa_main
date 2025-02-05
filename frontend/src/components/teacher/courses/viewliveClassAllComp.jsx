import React, { useState, useEffect } from "react";
import axios from "axios";
import "./viewliveClassAllComp.css"; // Import the CSS file

const LiveClassListCom = () => {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = localStorage.getItem("userEmail"); // Get logged-in teacher's email

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/liveclass/get-teacher-classes?email=${email}`);
        setLiveClasses(response.data); // Set the filtered live classes
      } catch (error) {
        alert("Failed to fetch live classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveClasses();
  }, [email]);

  if (loading) {
    return <div className="liveclasseslistssched-loading">Loading...</div>;
  }

  return (
    <div className="liveclasseslistssched-container">
      <h2 className="liveclasseslistssched-heading">Your Scheduled Live Classes</h2>
      <table className="liveclasseslistssched-table">
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Topic</th>
            <th>Date</th>
            <th>Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {liveClasses.length > 0 ? (
            liveClasses.map((liveClass) => (
              <tr key={liveClass._id}>
                <td>{liveClass.teacherName}</td>
                <td>{liveClass.topic}</td>
                <td>{new Date(liveClass.date).toLocaleDateString()}</td>
                <td>{liveClass.time}</td>
                <td>{liveClass.endtime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No live classes scheduled.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LiveClassListCom;
