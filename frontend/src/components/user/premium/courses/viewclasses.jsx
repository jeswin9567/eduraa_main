import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./viewclasses.css";

const UserClassDetail = () => {
  const { topic, subTopic } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/course/student/course/${encodeURIComponent(topic)}/${encodeURIComponent(subTopic)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch class details");
        }
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [topic, subTopic]);

  // Updated function to convert captions text to WebVTT format
  const createVTTContent = (captions, words) => {
    if (!words || !Array.isArray(words) || words.length === 0) return null;
    
    let vttContent = "WEBVTT\n\n";
    let currentLine = [];
    let lineCount = 1;
    
    for (let i = 0; i < words.length; i++) {
      currentLine.push(words[i]);
      
      // Create a new caption every 7 words or at the end of a sentence
      if (currentLine.length === 7 || 
          i === words.length - 1 || 
          words[i].text.match(/[.!?]$/)) {
        
        const startTime = currentLine[0].start / 1000; // Convert to seconds
        const endTime = currentLine[currentLine.length - 1].end / 1000;
        
        vttContent += `${lineCount}\n`;
        vttContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
        vttContent += `${currentLine.map(w => w.text).join(' ')}\n\n`;
        
        lineCount++;
        currentLine = [];
      }
    }
    
    return URL.createObjectURL(new Blob([vttContent], { type: 'text/vtt' }));
  };

  // Helper function to format time in HH:MM:SS.mmm format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  if (loading) return <div className="classdetail-loading">Loading...</div>;
  if (error) return <div className="classdetail-error">Error: {error}</div>;

  return (
    <div className="classdetail-container">
      <h2 className="classdetail-title">{subTopic}</h2>
      {classes.length === 0 ? (
        <p className="classdetail-empty">No content available</p>
      ) : (
        classes.map((classItem, index) => (
          <div key={classItem._id} className="classdetail-box">
            {/* Video Player */}
            <div className="classdetail-video">
              <video 
                controls
                className="video-player"
                onLoadedMetadata={(e) => {
                  // Ensure captions are displayed
                  const textTracks = e.target.textTracks;
                  if (textTracks.length > 0) {
                    textTracks[0].mode = 'showing';
                  }
                }}
              >
                <source src={classItem.video} type="video/mp4" />
                {classItem.words && (
                  <track 
                    label="English" 
                    kind="subtitles" 
                    srcLang="en" 
                    src={createVTTContent(classItem.captions, classItem.words)} 
                    default 
                  />
                )}
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Notes Section */}
            <div className="classdetail-content">
              <p className="classdetail-teacher">
                Uploaded by <span>{classItem.teacherName}</span>
              </p>
              <a 
                href={classItem.notes} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="classdetail-notes-btn"
              >
                View Notes (PDF)
              </a>
            </div>

            {/* Chapters/Transcript Section */}
            {classItem.chapters && (
              <div className="classdetail-chapters">
                <h3>Chapters</h3>
                <div className="chapters-list">
                  {classItem.chapters.map((chapter, idx) => (
                    <div key={idx} className="chapter-item">
                      <h4>{chapter.headline}</h4>
                      <p>{chapter.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserClassDetail;
