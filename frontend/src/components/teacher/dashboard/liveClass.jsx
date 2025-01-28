import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './liveClassesBox.css';

const LiveClassesBox = () => {

  const navigate = useNavigate();

  const [liveClass, setLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNextLiveClass = async () => {
      try {
        const teacherEmail = localStorage.getItem("userEmail"); // Get the logged-in teacher's email
        
        if (!teacherEmail) {
          setError("Teacher email not found in local storage.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/liveclass/next-live-class/${teacherEmail}`
        );
        
        if (response.data.message) {
          // If the backend response has a message indicating no live classes
          setError(response.data.message);  // Show the custom message from the backend
        } else {
          setLiveClass(response.data);  // Set the live class data
        }
        setLoading(false);
      } catch (err) {
        setError("Could not fetch the live class.");
        setLoading(false);
      }
    };

    fetchNextLiveClass();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="liveclazbxs">
      {error ? (
        <p>{error}</p>  // Display error or no live class message
      ) : (
        liveClass ? (
          <div>
            <h3>Next Live Class</h3>
            <p><strong>Topic:</strong> {liveClass.topic}</p>
            <p><strong>Date:</strong> {new Date(liveClass.date).toLocaleString()}</p>
            <p><strong>Time:</strong> {liveClass.time} - {liveClass.endtime}</p>

            {/* Buttons without functionality */}
            <div className="buttons">
              <button className="remind-button">Remind</button>
              <button className="schedule-button" onClick={() => navigate('/teacher/viewscheduleclasses')}>List Schedules</button>
            </div>
          </div>
        ) : (
          <p>No upcoming live classes available at the moment.</p>  // Display when no live class is found
        )
      )}
    </div>
  );
};

export default LiveClassesBox;
