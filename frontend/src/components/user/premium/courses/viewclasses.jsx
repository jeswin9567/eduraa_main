import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import "./viewclasses.css";

const UserClassDetail = () => {
  const { topic, subTopic } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [activeFeedbackClassId, setActiveFeedbackClassId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

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

  const handleVideoComplete = async (classId) => {
    try {
      // Get student email from your auth context/storage
      const studentEmail = localStorage.getItem('userEmail'); // Replace with actual student email

      const response = await fetch(
        `http://localhost:5000/api/course/student/complete-class/${classId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentEmail }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to mark class as completed');
      }
    } catch (error) {
      console.error('Error marking class as completed:', error);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const studentEmail = localStorage.getItem('userEmail');

    // Validate rating before submission
    if (!rating) {
      alert("Please select a rating before submitting");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/course/student/feedback/${activeFeedbackClassId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            studentEmail,
            feedback,
            rating: Number(rating) // Ensure rating is sent as a number
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      // Reset form and close modal
      setFeedback("");
      setRating(0);
      setShowFeedbackModal(false);
      setActiveFeedbackClassId(null);
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.message);
    }
  };

  const StarRating = () => {
    return (
      <div className="star-rating">
        <p>Rate this course: <span className="rating-value">{rating}/5</span></p>
        <div className="stars">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  checked={rating === ratingValue}
                  onChange={() => setRating(ratingValue)}
                />
                <FaStar
                  className="star"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={24}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) return <div className="classdetail-loading">Loading...</div>;
  if (error) return <div className="classdetail-error">Error: {error}</div>;

  return (
    <div className="classdetail-container">
      {/* Show success message if showSuccessMessage is true */}
      {showSuccessMessage && (
        <div className="success-message">
          Feedback submitted successfully!
        </div>
      )}
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
                onEnded={() => handleVideoComplete(classItem._id)}
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

            {/* Add Feedback Button */}
            <div className="classdetail-feedback">
              <button 
                className="feedback-btn"
                onClick={() => {
                  setActiveFeedbackClassId(classItem._id);
                  setShowFeedbackModal(true);
                }}
              >
                Give Feedback
              </button>
            </div>
          </div>
        ))
      )}

      {/* Updated Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <h3>Submit Feedback</h3>
            <form onSubmit={handleFeedbackSubmit}>
              <StarRating />
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter your feedback here..."
                required
              />
              <div className="feedback-modal-buttons">
                <button 
                  type="submit" 
                  disabled={!rating}
                >
                  Submit
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedback("");
                    setRating(0);
                    setActiveFeedbackClassId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserClassDetail;
