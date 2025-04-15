import  ZoomVideo  from '@zoom/videosdk';

let client;

export const initZoom = async () => {
  client = ZoomVideo.createClient();
  return client;
};

export const generateSessionToken = async (role = 'participant', meetingId = '') => {
  try {
    const response = await fetch('/api/zoom-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role: role === 'doctor' ? 1 : 0,
        meetingNumber: meetingId
      })
    });
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to authenticate with Zoom');
  }
};

export const joinSession = async (sessionName, userName, sessionToken) => {
  try {
    if (!sessionName || !userName || !sessionToken) {
      throw new Error('Missing required parameters');
    }
    
    await client.join(sessionName, sessionToken, userName);
    return client;
  } catch (error) {
    console.error('Error joining session:', error);
    let userMessage = 'Failed to join session';
    if (error.message.includes('invalid token')) userMessage = 'Authentication failed';
    if (error.message.includes('session not found')) userMessage = 'Meeting not found';
    throw new Error(userMessage);
  }
};

export const startVideo = async () => {
  try {
    await client.startVideo();
    return client.getMediaStream();
  } catch (error) {
    console.error('Error starting video:', error);
    throw new Error('Failed to start video');
  }
};

export const stopVideo = async () => {
  try {
    await client.stopVideo();
  } catch (error) {
    console.error('Error stopping video:', error);
    throw new Error('Failed to stop video');
  }
};

export const startAudio = async () => {
  try {
    await client.startAudio();
  } catch (error) {
    console.error('Error starting audio:', error);
    throw new Error('Failed to start audio');
  }
};

export const stopAudio = async () => {
  try {
    await client.stopAudio();
  } catch (error) {
    console.error('Error stopping audio:', error);
    throw new Error('Failed to stop audio');
  }
};

export const startScreenShare = async () => {
  try {
    const stream = await client.getMediaStream();
    await stream.startShareScreen();
    return stream;
  } catch (error) {
    console.error('Error starting screen share:', error);
    throw new Error('Failed to start screen sharing');
  }
};

export const stopScreenShare = async () => {
  try {
    const stream = client.getMediaStream();
    await stream.stopShareScreen();
  } catch (error) {
    console.error('Error stopping screen share:', error);
    throw new Error('Failed to stop screen sharing');
  }
};

export const leaveSession = async () => {
  try {
    await client.leave();
  } catch (error) {
    console.error('Error leaving session:', error);
    throw new Error('Failed to leave meeting');
  }
};

// Chat functions
export const sendChatMessage = async (message, userId = null) => {
  try {
    if (userId) {
      await client.sendChat(message, userId);
    } else {
      await client.sendChat(message);
    }
  } catch (error) {
    console.error('Error sending chat:', error);
    throw new Error('Failed to send message');
  }
};

export const subscribeToChat = (callback) => {
  client.on('chat-on-message', (payload) => {
    callback(payload);
  });
};

export const subscribeToUserEvents = (callback) => {
  client.on('user-added', (payload) => callback('added', payload));
  client.on('user-removed', (payload) => callback('removed', payload));
};