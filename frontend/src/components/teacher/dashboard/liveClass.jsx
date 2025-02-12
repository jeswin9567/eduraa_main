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

  const remindStudents = async () => {
    try {
      await axios.post(`http://localhost:5000/api/liveclass/remind/${liveClass._id}`);
      alert("Reminder email sent to students!");
    } catch (err) {
      setError("Could not send reminder email.");
    }
  };
  
  

  const startLiveClass = async () => {
    try {
      await axios.put(`http://localhost:5000/api/liveclass/start/${liveClass._id}`);
      navigate(`/teacher/video-call/${liveClass._id}`);
    } catch (err) {
      setError("Could not start the live class.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="liveclazbxs">
      {error ? (
        <p>{error}</p>
      ) : (
        liveClass ? (
          <div>
            <h3>Next Live Class</h3>
            <p><strong>Topic:</strong> {liveClass.topic}</p>
            <p><strong>Date:</strong> {new Date(liveClass.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {liveClass.time} - {liveClass.endtime}</p>

            <div className="buttons">
              <button 
                className="schedule-button"
                onClick={startLiveClass}
              >
                Start Class
              </button>
              <button className="remind-button" onClick={remindStudents}>Remind</button>

            </div>
          </div>
        ) : (
          <p>No upcoming live classes available at the moment.</p>
        )
      )}
    </div>
  );
};

export default LiveClassesBox;
