import React, { useState, useEffect } from "react";
import axios from "axios";
import "./announcement.css"; // Import the CSS file

const AnnouncementsCom = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/announcement/get");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem("userEmail"); // Get the email from local storage
      await axios.post("http://localhost:5000/api/announcement/create", { title, content, createdBy: userEmail, targetAudience });
      fetchAnnouncements();
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error creating announcement", error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcement/delete/${id}`);
      fetchAnnouncements(); // Refresh the announcements list after deletion
    } catch (error) {
      console.error("Error deleting announcement", error);
    }
  };

  return (
    <div className="mananouncementcontainer">
      <h2>Announcements</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
          <option value="all">All</option>
          <option value="teachers">Teachers</option>
          <option value="students">Students</option>
        </select>
        <button type="submit">Create Announcement</button>
      </form>

      <h3>Existing Announcements</h3>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement._id}>
            <h4>{announcement.title}</h4>
            <p>{announcement.content}</p>
            <small>For: {announcement.targetAudience}</small>
            <button onClick={() => deleteAnnouncement(announcement._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsCom;
