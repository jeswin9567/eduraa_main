import React, { useState, useEffect } from "react";
import axios from "axios";
import "./viewannouncement.css"; // Ensure this CSS file is present

const TeacherAnnouncementsCom = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);

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
      const response = await axios.post("http://localhost:5000/api/announcement/check-role", { email: userEmail });
      if (response.data.role === "teacher") {
        setIsTeacher(true);
        fetchAnnouncements();
      } else {
        setIsTeacher(false);
      }
    } catch (error) {
      console.error("Error checking user role", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/announcement/get-teacher");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  return (
    <div className="teachervannounce-container">
      <h2>Announcements</h2>
      {!isTeacher ? (
        <p className="teachervannounce-message">You are not authorized to view this section.</p>
      ) : (
        <ul className="teachervannounce-list">
          {announcements.map((announcement) => (
            <li key={announcement._id} className="teachervannounce-item">
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

export default TeacherAnnouncementsCom;
