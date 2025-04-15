import React, { useState, useRef, useEffect } from 'react';
import {
  initZoom,
  generateSessionToken,
  joinSession,
  startVideo,
  stopVideo,
  startAudio,
  stopAudio,
  startScreenShare,
  stopScreenShare,
  leaveSession,
  sendChatMessage,
  subscribeToChat,
  subscribeToUserEvents
} from '../../helpers/utils/ZoomService.tsx';
// import './DoctorDashboard.scss';

const DoctorDashboard = () => {
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);

  // Initialize Zoom and set up event listeners
  useEffect(() => {
    const initialize = async () => {
      await initZoom();
      
      subscribeToUserEvents((event, payload) => {
        if (event === 'added') {
          setRemoteUsers(prev => [...prev, payload]);
        } else {
          setRemoteUsers(prev => prev.filter(user => user.userId !== payload.userId));
        }
      });

      subscribeToChat((payload) => {
        setMessages(prev => [...prev, {
          sender: payload.sender.name,
          text: payload.text,
          isSelf: payload.sender.userId === client.getCurrentUserInfo().userId,
          timestamp: new Date().toLocaleTimeString()
        }]);
      });
    };

    initialize();

    return () => {
      leaveSession();
    };
  }, []);

  // Attach local video stream
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localStream.attachVideo(localVideoRef.current);
    }
  }, [localStream]);

  // Attach remote video streams
  useEffect(() => {
    remoteUsers.forEach(user => {
      const videoElement = document.getElementById(`remote-video-${user.userId}`);
      if (videoElement && user.videoStream) {
        user.videoStream.attachVideo(videoElement);
      }
    });
  }, [remoteUsers]);

  const startMeeting = async () => {
    try {
      const sessionName = `telemed-${Date.now()}`;
      const token = await generateSessionToken('doctor', sessionName);
      
      await joinSession(sessionName, 'Doctor', token);
      const stream = await startVideo();
      await startAudio();
      
      setLocalStream(stream);
      setMeetingId(sessionName);
      setIsMeetingStarted(true);
      
      // Notify backend that meeting has started
      notifyMeetingStart(sessionName);
    } catch (error) {
      alert(error.message);
    }
  };

  const endMeeting = async () => {
    try {
      await stopVideo();
      await stopAudio();
      if (isSharingScreen) await stopScreenShare();
      await leaveSession();
      
      setIsMeetingStarted(false);
      setMeetingId('');
      setRemoteUsers([]);
      setIsSharingScreen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isSharingScreen) {
        await stopScreenShare();
        setIsSharingScreen(false);
      } else {
        await startScreenShare();
        setIsSharingScreen(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    try {
      await sendChatMessage(currentMessage);
      setMessages(prev => [...prev, {
        sender: 'You',
        text: currentMessage,
        isSelf: true,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setCurrentMessage('');
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const notifyMeetingStart = async (meetingId) => {
    // Implement your WebSocket or API call to notify patients
    console.log('Meeting started with ID:', meetingId);
  };

  return (
    <div className="dashboard-container">
      <h2>Doctor Dashboard</h2>
      
      {!isMeetingStarted ? (
        <div className="start-meeting-section">
          <button onClick={startMeeting} className="primary-button">
            Start Consultation
          </button>
        </div>
      ) : (
        <>
          <div className="meeting-info">
            <p>Meeting ID: <strong>{meetingId}</strong></p>
            <button onClick={endMeeting} className="danger-button">
              End Consultation
            </button>
          </div>
          
          <div className="video-container">
            <div className="local-video">
              <h3>Your Camera</h3>
              <video ref={localVideoRef} autoPlay playsInline muted />
              <div className="video-controls">
                <button onClick={toggleScreenShare}>
                  {isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
                </button>
              </div>
            </div>
            
            <div className="remote-videos" ref={remoteVideoContainerRef}>
              <h3>Patients ({remoteUsers.length})</h3>
              {remoteUsers.map(user => (
                <div key={user.userId} className="remote-video-item">
                  <video 
                    id={`remote-video-${user.userId}`}
                    autoPlay
                    playsInline
                  />
                  <p>{user.displayName}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="chat-container">
            <h3>Consultation Chat</h3>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.isSelf ? 'self' : ''}`}>
                  <span className="message-sender">{msg.sender}</span>
                  <p className="message-text">{msg.text}</p>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;