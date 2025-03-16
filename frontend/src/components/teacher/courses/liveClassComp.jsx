import React, { useState, useEffect } from "react";
import axios from "axios";
import "./liveClassComp.css"; // Import CSS file

const ScheduleLiveClassCom = () => {
  const [formData, setFormData] = useState({
    teacherName: "",
    topic: "",
    date: "",
    time: "",
    endtime: "",
  });

  const [errors, setErrors] = useState({
    topic: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchTeacherName = async () => {
      const email = localStorage.getItem("userEmail"); // Fetch email from localStorage
      if (email) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/liveclass/teacher/${email}`);
          const { firstname, lastname } = response.data;
          setFormData((prev) => ({
            ...prev,
            teacherName: `${firstname} ${lastname}`, // Auto-fill teacher name
          }));
        } catch (error) {
          alert("Failed to fetch teacher data.");
        }
      }
    };

    fetchTeacherName();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "topic") {
      const topicRegex = /^(?=.*[A-Za-z])[A-Za-z0-9\s]*$/;
      setErrors((prev) => ({
        ...prev,
        topic: topicRegex.test(value) ? "" : "Topic must contain letters and can include numbers, but no special characters.",
      }));
    }
  
    if (name === "date") {
      const today = new Date().toISOString().split("T")[0];
      setErrors((prev) => ({
        ...prev,
        date: value < today ? "Date must be today or in the future." : "",
      }));
    }
  
    if (name === "time" || name === "endtime") {
      const { time, endtime } = { ...formData, [name]: value };
  
      if (time && endtime) {
        const startTime = new Date(`1970-01-01T${time}:00`);
        const endTime = new Date(`1970-01-01T${endtime}:00`);
  
        const minStartTime = new Date(`1970-01-01T08:00:00`);
        const maxEndTime = new Date(`1970-01-01T22:00:00`);
  
        if (startTime < minStartTime || endTime > maxEndTime) {
          setErrors((prev) => ({
            ...prev,
            time: "Classes can only be scheduled between 8 AM and 10 PM.",
          }));
        } 
        // Ensure class duration is between 1 hour and 2 hours
        else if (endTime - startTime < 60 * 60 * 1000) {
          setErrors((prev) => ({
            ...prev,
            time: "Class duration must be at least 1 hour.",
          }));
        } 
        else if (endTime - startTime > 2 * 60 * 60 * 1000) {
          setErrors((prev) => ({
            ...prev,
            time: "Class duration cannot exceed 2 hours.",
          }));
        } 
        else {
          setErrors((prev) => ({ ...prev, time: "" }));
        }
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("Email not found in localStorage.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/liveclass/schedule-live-class`, {
        ...formData,
        teacherEmail: email,
      });
      alert(response.data.message);
      setFormData({ ...formData, topic: "", date: "", time: "", endtime: "" }); // Clear form except teacherName
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div className="scheduleclasscomp-container">
      <h2 className="scheduleclasscomp-heading">Schedule Live Class</h2>
      <form onSubmit={handleSubmit}>
        <div className="scheduleclasscomp-field">
          <label>Teacher Name</label>
          <input type="text" name="teacherName" value={formData.teacherName} disabled className="scheduleclasscomp-input disabled" />
        </div>
        <div className="scheduleclasscomp-field">
          <label>Topic</label>
          <input type="text" name="topic" value={formData.topic} onChange={handleChange} className={`scheduleclasscomp-input ${errors.topic ? "error" : ""}`} required />
          {errors.topic && <p className="scheduleclasscomp-error">{errors.topic}</p>}
        </div>
        <div className="scheduleclasscomp-field">
          <label>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className={`scheduleclasscomp-input ${errors.date ? "error" : ""}`} required />
          {errors.date && <p className="scheduleclasscomp-error">{errors.date}</p>}
        </div>
        <div className="scheduleclasscomp-field">
          <label>Start-Time</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} className="scheduleclasscomp-input" required />
        </div>
        <div className="scheduleclasscomp-field">
          <label>End-Time</label>
          <input type="time" name="endtime" value={formData.endtime} onChange={handleChange} className={`scheduleclasscomp-input ${errors.time ? "error" : ""}`} required />
          {errors.time && <p className="scheduleclasscomp-error">{errors.time}</p>}
        </div>
        <div className="scheduleclasscomp-field">
          <label>Status</label>
          <input type="text" value={formData.status ? "Ongoing" : "Completed"} disabled className="scheduleclasscomp-input disabled" />
        </div>

        <button type="submit" className="scheduleclasscomp-button">Schedule</button>
      </form>
    </div>
  );
};

export default ScheduleLiveClassCom;
