import React, { useState, useEffect } from "react";
import './addCourseComp.css';

const UploadClass = () => {
  const [topics, setTopics] = useState([]); // State to store fetched topics
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [notesFile, setNotesFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [useDropdown, setUseDropdown] = useState(true); // Toggle between dropdown and manual input
  const [errors, setErrors] = useState({
    topic: "",
    subTopic: "",
    notes: "",
    video: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    // Fetch topics from the database
    const fetchTopics = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/topics");
        const data = await response.json();
        setTopics(data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  const validateText = (value) => {
    const hasLetter = /[a-zA-Z]/.test(value);  // Check if contains at least one letter
    const validChars = /^[a-zA-Z0-9\- ]+$/;    // Allow letters, numbers, hyphens, spaces
    return hasLetter && validChars.test(value); // Must contain letter and only valid chars
  };

  const handleTopicChange = (e) => {
    const value = e.target.value;
    setTopic(value);
    if (!validateText(value)) {
      setErrors((prev) => ({ ...prev, topic: "Topic must contain at least one letter and can only include letters, numbers, hyphens, and spaces." }));
    } else {
      setErrors((prev) => ({ ...prev, topic: "" }));
    }
  };

  const handleSubTopicChange = (e) => {
    const value = e.target.value;
    setSubTopic(value);
    if (!validateText(value)) {
      setErrors((prev) => ({ ...prev, subTopic: "Sub-topic must contain at least one letter and can only include letters, numbers, hyphens, and spaces." }));
    } else {
      setErrors((prev) => ({ ...prev, subTopic: "" }));
    }
  };

  const handleNotesChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, notes: "Only PDF files are allowed." }));
      setNotesFile(null);
    } else {
      setErrors((prev) => ({ ...prev, notes: "" }));
      setNotesFile(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    const validVideoTypes = ["video/mp4", "video/avi", "video/mkv", "video/mov"];
    if (file && !validVideoTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, video: "Only video files are allowed (MP4, AVI, MKV, MOV)." }));
      setVideoFile(null);
    } else {
      setErrors((prev) => ({ ...prev, video: "" }));
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic || !subTopic || !notesFile || !videoFile) {
      alert("Please fill in all fields and upload the required files.");
      return;
    }

    setIsUploading(true);
    setUploadProgress('Uploading files and generating captions...');

    const teacherEmail = localStorage.getItem("userEmail");

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("subTopic", subTopic);
    formData.append("notes", notesFile);
    formData.append("video", videoFile);
    formData.append("teacherEmail", teacherEmail);

    try {
      const response = await fetch("http://localhost:5000/api/course/upload-class", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Class uploaded successfully with captions!");
        setTopic("");
        setSubTopic("");
        setNotesFile(null);
        setVideoFile(null);
        document.getElementById("notes").value = "";
        document.getElementById("video").value = "";
      } else {
        alert(data.message || "Failed to upload class. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading class:", error);
      alert("An error occurred while uploading. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="teachupldclzcom-container">
      <h2 className="teachupldclzcom-heading">Upload Class</h2>
      <form onSubmit={handleSubmit} className="teachupldclzcom-form">
        <div className="teachupldclzcom-form-group">
          <label className="teachupldclzcom-label">Topic</label>
          <div className="teachupldclzcom-radio-group">
            <label>
              <input
                type="radio"
                value="dropdown"
                checked={useDropdown}
                onChange={() => setUseDropdown(true)}
              />
              Choose from existing
            </label>
            <label>
              <input
                type="radio"
                value="manual"
                checked={!useDropdown}
                onChange={() => setUseDropdown(false)}
              />
              Enter manually
            </label>
          </div>
          {useDropdown ? (
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="teachupldclzcom-input"
              required
            >
              <option value="">Select a topic</option>
              {topics.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={topic}
              onChange={handleTopicChange}
              placeholder="Enter main topic"
              className="teachupldclzcom-input"
              required
            />
          )}
          {errors.topic && <p className="teachupldclzcom-error">{errors.topic}</p>}
        </div>
        <div className="teachupldclzcom-form-group">
          <label htmlFor="subTopic" className="teachupldclzcom-label">
            Sub Topic
          </label>
          <input
            id="subTopic"
            type="text"
            value={subTopic}
            onChange={handleSubTopicChange}
            placeholder="Enter sub topic"
            className="teachupldclzcom-input"
            required
          />
          {errors.subTopic && <p className="teachupldclzcom-error">{errors.subTopic}</p>}
        </div>
        <div className="teachupldclzcom-form-group">
          <label htmlFor="notes" className="teachupldclzcom-label">
            Upload Notes (PDF)
          </label>
          <input
            id="notes"
            type="file"
            accept="application/pdf"
            onChange={handleNotesChange}
            className="teachupldclzcom-input-file"
            required
          />
          {errors.notes && <p className="teachupldclzcom-error">{errors.notes}</p>}
        </div>
        <div className="teachupldclzcom-form-group">
          <label htmlFor="video" className="teachupldclzcom-label">
            Upload Video
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="teachupldclzcom-input-file"
            required
          />
          {errors.video && <p className="teachupldclzcom-error">{errors.video}</p>}
        </div>
        {isUploading && (
          <div className="upload-progress">
            <p>{uploadProgress}</p>
          </div>
        )}
        <button 
          type="submit" 
          className="teachupldclzcom-submit-button"
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Class'}
        </button>
      </form>
    </div>
  );
};

export default UploadClass;
