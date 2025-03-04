import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateSubtopicPage = () => {
  const { subtopicId } = useParams();
  const navigate = useNavigate();
  const [subtopic, setSubtopic] = useState(null);
  const [subTopicName, setSubTopicName] = useState("");
  const [notes, setNotes] = useState("");
  const [video, setVideo] = useState("");
  const [error, setError] = useState("");
  const [notesFile, setNotesFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  useEffect(() => {
    const fetchSubtopic = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/course/subtopic/${subtopicId}`);
        if (!response.ok) throw new Error("Failed to fetch subtopic");
        const data = await response.json();
        setSubtopic(data);
        setSubTopicName(data.subTopic);
        setNotes(data.notes);
        setVideo(data.video);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSubtopic();
  }, [subtopicId]);

  const handleUpdate = async () => {
    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append("subTopic", subTopicName);

      if (notesFile) {
        formData.append("notes", notesFile);
      } else {
        formData.append("notes", notes);
      }

      if (videoFile) {
        setProcessingStatus('Uploading video and generating captions...');
        formData.append("video", videoFile);
      } else {
        formData.append("video", video);
      }

      const response = await fetch(`http://localhost:5000/api/course/update-subtopic/${subtopicId}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update subtopic");

      const result = await response.json();
      setProcessingStatus('Update completed successfully!');
      setTimeout(() => {
        navigate(`/subtopics/${subtopic.topic}`);
      }, 1500);

    } catch (err) {
      setError(err.message);
      setProcessingStatus('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Inline styles
  const containerStyle = {
    height:"100%",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  };

  const errorStyle = {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Update Subtopic</h2>
      {error && <div style={errorStyle}>Error: {error}</div>}
      {processingStatus && (
        <div style={{
          textAlign: 'center',
          color: '#007bff',
          margin: '10px 0',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '5px'
        }}>
          {processingStatus}
        </div>
      )}
      {subtopic ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Subtopic Name</label>
            <input
              type="text"
              style={inputStyle}
              value={subTopicName}
              onChange={(e) => setSubTopicName(e.target.value)}
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Notes (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setNotesFile(e.target.files[0])}
            />
            {notes && <p>Current file: {notes}</p>}
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
            {video && <p>Current file: {video}</p>}
          </div>
          <button 
            style={{
              ...buttonStyle,
              opacity: isProcessing ? 0.7 : 1,
              cursor: isProcessing ? 'not-allowed' : 'pointer'
            }} 
            onClick={handleUpdate}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Update Subtopic'}
          </button>
        </form>
      ) : (
        <p>Loading subtopic...</p>
      )}
    </div>
  );
};

export default UpdateSubtopicPage;
