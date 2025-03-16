import React, { useState, useEffect } from "react";
import axios from "axios";
import "./announcement.css"; // Ensure this CSS file is present

const StudentAnnouncementsCom = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        console.error("No user email found in localStorage");
        return;
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/announcement/check-role`, { email: userEmail });
      if (response.data.role === "user") {
        setIsStudent(true);
        fetchAnnouncements();
      } else {
        setIsStudent(false);
      }
    } catch (error) {
      console.error("Error checking user role", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/announcement/get-student`);
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  return (
    <div className="studentvannounce-container">
      <h2>Student Announcements</h2>
      {!isStudent ? (
        <p className="studentvannounce-message">You are not authorized to view this section.</p>
      ) : (
        <ul className="studentvannounce-list">
          {announcements.map((announcement) => (
            <li key={announcement._id} className="studentvannounce-item">
              <h4>{announcement.title}</h4>
              <p>{announcement.content}</p>
              <small>For: {announcement.targetAudience}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentAnnouncementsCom;
