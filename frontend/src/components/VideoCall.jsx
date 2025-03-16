import { JitsiMeeting } from '@jitsi/react-sdk';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VideoCall.css';
import useAuth from '../../function/useAuth';

const VideoCall = () => {
  useAuth();
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [apiRef, setApiRef] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/liveclass/${classId}`);
        setClassDetails(response.data);
        setIsTeacher(response.data.teacherEmail === userEmail);
      } catch (err) {
        console.error('Error fetching class details:', err);
      }
    };

    fetchClassDetails();
  }, [classId, userEmail]);

  const handleClose = async () => {
    if (isTeacher) {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/liveclass/end/${classId}`);
        navigate('/teacher/viewscheduleclasses');
      } catch (err) {
        console.error('Error ending class:', err);
      }
    } else {
      navigate('/student/classschedule');
    }
  };

  if (!classDetails) return <div>Loading...</div>;

  return (
    <div className="video-call-container">
      <div className="class-info">
        <h2>{classDetails.topic}</h2>
        <p>Teacher: {classDetails.teacherName}</p>
      </div>

      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`eduraa-${classId}`}
        configOverwrite={{
          startWithAudioMuted: !isTeacher,
          startWithVideoMuted: !isTeacher,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          disableInviteFunctions: true,
          enableEmailInStats: false,
          enableClosePage: false,
          readOnlyName: true,
          disableProfile: true,
          enableWelcomePage: false,
          toolbarButtons: isTeacher ? [
            'camera',
            'chat',
            'desktop',
            'fullscreen',
            'microphone',
            'participants-pane',
            'raisehand',
            'settings',
            'mute-everyone',
            'mute-video-everyone'
          ] : [
            'camera',
            'chat',
            'microphone',
            'raisehand',
            'fullscreen'
          ],
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          MOBILE_APP_PROMO: false,
          HIDE_INVITE_MORE_HEADER: true,
          DISABLE_FOCUS_INDICATOR: true,
          DEFAULT_BACKGROUND: '#1a1a1a',
          DEFAULT_LOCAL_DISPLAY_NAME: userEmail,
          TOOLBAR_ALWAYS_VISIBLE: true,
          SETTINGS_SECTIONS: ['devices', 'language']
        }}
        userInfo={{
          displayName: userEmail,
          email: userEmail,
          moderator: isTeacher
        }}
        onApiReady={(externalApi) => {
          setApiRef(externalApi);
          
          if (isTeacher) {
            externalApi.executeCommand('grantModerator');
            externalApi.executeCommand('subject', classDetails.topic);
          }
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '80vh';
          iframeRef.style.width = '100%';
          iframeRef.allow = "camera; microphone; display-capture; autoplay; clipboard-write; fullscreen";
        }}
      />

      <div className="controls">
        {isTeacher ? (
          <button className="end-button" onClick={handleClose}>
            End Class
          </button>
        ) : (
          <button className="leave-button" onClick={handleClose}>
            Leave Class
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCall; 