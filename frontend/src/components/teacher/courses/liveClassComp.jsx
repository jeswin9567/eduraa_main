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
          const response = await axios.get(`http://localhost:5000/api/liveclass/teacher/${email}`);
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

    // Validation logic
    if (name === "topic") {
      const topicRegex = /^(?=.*[A-Za-z])[A-Za-z0-9\s]*$/; 
      if (!topicRegex.test(value)) {
        setErrors((prev) => ({ ...prev, topic: "Topic must contain letters and can include numbers, but no special characters." }));
      } else {
        setErrors((prev) => ({ ...prev, topic: "" }));
      }
    }
    

    if (name === "date") {
      const today = new Date().toISOString().split("T")[0];
      if (value < today) {
        setErrors((prev) => ({ ...prev, date: "Date must be today or in the future." }));
      } else {
        setErrors((prev) => ({ ...prev, date: "" }));
      }
    }

    if (name === "time" || name === "endtime") {
      const { time, endtime } = { ...formData, [name]: value };
      if (time && endtime && time >= endtime) {
        setErrors((prev) => ({
          ...prev,
          time: "End-Time must be after Start-Time.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, time: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error)) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const email = localStorage.getItem("userEmail"); // Get email from localStorage
    if (!email) {
      alert("Email not found in localStorage.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/liveclass/schedule-live-class", {
        ...formData,
        teacherEmail: email, // Add email from localStorage
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
          <input
            type="text"
            name="teacherName"
            value={formData.teacherName}
            disabled
            className="scheduleclasscomp-input disabled"
          />
        </div>
        <div className="scheduleclasscomp-field">
          <label>Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className={`scheduleclasscomp-input ${errors.topic ? "error" : ""}`}
            required
          />
          {errors.topic && <p className="scheduleclasscomp-error">{errors.topic}</p>}
        </div>
        <div className="scheduleclasscomp-field">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`scheduleclasscomp-input ${errors.date ? "error" : ""}`}
            required
          />
          {errors.date && <p className="scheduleclasscomp-error">{errors.date}</p>}
        </div>
        <div className="scheduleclasscomp-field">
          <label>Start-Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="scheduleclasscomp-input"
            required
          />
        </div>
        <div className="scheduleclasscomp-field">
          <label>End-Time</label>
          <input
            type="time"
            name="endtime"
            value={formData.endtime}
            onChange={handleChange}
            className={`scheduleclasscomp-input ${errors.time ? "error" : ""}`}
            required
          />
          {errors.time && <p className="scheduleclasscomp-error">{errors.time}</p>}
        </div>
        <div className="scheduleclasscomp-field">
  <label>Status</label>
  <input
    type="text"
    value={formData.status ? "Ongoing" : "Completed"}
    disabled
    className="scheduleclasscomp-input disabled"
  />
</div>

        <button type="submit" className="scheduleclasscomp-button">
          Schedule
        </button>
      </form>
    </div>
  );
};

export default ScheduleLiveClassCom;
