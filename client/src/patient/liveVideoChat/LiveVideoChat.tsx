import React, { useState } from 'react';
import { 
  Box, Typography, TextField, IconButton, Paper 
} from '@mui/material';
import { Send, AttachFile, Image } from '@mui/icons-material';
import TestAudioVideo from "../../helpers/testAudioVideo/TestAudioVideo.tsx"

interface ChatMessage {
  sender: string;
  message?: string;
  fileBinary?: string;
  fileHeader?: string;
  time?: string;
}

const LiveVideoChat = () => {
  const [isMeetStart, setIsMeetStart] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);
  const [currentChat, setCurrentChat] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [fileFormatMsg, setFileFormatMsg] = useState(false);
  const [fileSizeMsg, setFileSizeMsg] = useState(false);
  const [providerObj, setProviderObj] = useState({ userName: 'Dr. Sanju' });

  const handleSendChatMsg = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        sender: 'user',
        message: chatMessage,
        time: new Date().toLocaleTimeString(),
      };
      setCurrentChat([...currentChat, newMessage]);
      setChatMessage('');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFileSizeMsg(true);
        return;
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        setFileFormatMsg(true);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const newMessage: ChatMessage = {
          sender: 'user',
          fileBinary: reader.result as string,
          fileHeader: file.name,
          time: new Date().toLocaleTimeString(),
        };
        setCurrentChat([...currentChat, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box 
      p={2} 
      sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", md: "row" }, 
        height: "100vh" 
      }}
    >
      
      {/* Video Call Section (Left Side) */}
      <Box 
        sx={{ 
          flex: 2,
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          p: 2
        }}
      >
        <Paper sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {isMeetStart ? (
            <iframe
              src="https://meet.jit.si/FewaTelemedicine"
              allow="camera; microphone; fullscreen; display-capture"
              style={{ width: "100%", height: "100%", border: "none" }}
              frameBorder="0"
              allowFullScreen
            />
          ) : isWaiting ? (
            <TestAudioVideo />
          ) : (
            <Typography variant="h5" align="center">
              Please wait, <strong>{providerObj.userName}</strong> will start this secure video visit.
            </Typography>
          )}
        </Paper>
      </Box>

      {/* Chat Section (Right Side) */}
      <Box 
        sx={{ 
          flex: 1, // Takes 1/3rd of the space
          display: "flex", 
          flexDirection: "column",
          p: 2
        }}
      >
        <Paper elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
          <Typography variant="h6" sx={{ pb: 1 }}>
            Chat with {providerObj.userName}
          </Typography>

          {/* Chat Messages */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 1, mb: 2 }}>
            <Typography variant="body2">Today</Typography>
            {currentChat.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: msg.sender !== providerObj.userName ? "row-reverse" : "row",
                  alignItems: "center",
                  mb: 1,
                  gap: 1
                }}
              >
                <Typography variant="caption">{msg.time}</Typography>
                {msg.fileBinary ? (
                  <a href={msg.fileBinary} download={msg.fileHeader} style={{ color: "#8378dd" }}>
                    {msg.fileHeader}
                  </a>
                ) : (
                  <Typography sx={{ bgcolor: "#f1f1f1", p: 1, borderRadius: 2 }}>
                    {msg.message}
                  </Typography>
                )}
              </Box>
            ))}
            {fileFormatMsg && (
              <Typography color="error">Upload only image or PDF files.</Typography>
            )}
            {fileSizeMsg && (
              <Typography color="error">Please upload a file less than 2MB.</Typography>
            )}
          </Box>

          {/* Chat Input */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton component="label">
              <Image />
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </IconButton>
            <IconButton component="label">
              <AttachFile />
              <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChatMsg()}
            />
            <IconButton onClick={handleSendChatMsg}>
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Box>

    </Box>
  );
};

export default LiveVideoChat;
