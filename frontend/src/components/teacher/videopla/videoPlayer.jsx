import React from "react";
import { useLocation } from "react-router-dom";
import "./videoPlayerPage.css"; // Optional for styling
import useAuth from "../../../function/useAuth";

const VideoPlayerPage = () => {
  useAuth();
  const location = useLocation(); // Get the passed state (video URL)
  const { videoUrl } = location.state || {}; // Get video URL from state passed through navigation

  if (!videoUrl) {
    return <div>Video not found</div>;
  }

  return (
    <div className="video-player-container">
      <h2>Video Player</h2>
      <video controls className="video-player" src={videoUrl}>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayerPage;
