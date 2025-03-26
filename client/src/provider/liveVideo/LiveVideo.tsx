import React, { useState, useRef, useEffect } from "react";
import { Box, Button, IconButton, TextField, Typography, Paper } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import VideoConference from "../videoConference/VideoConference.tsx";
// import JitsiMeetComponent from "./JitsiMeetComponent"; // Assume this is the Jitsi component

interface ChatMessage {
  sender: string;
  receiver: string;
  message?: string;
  file?: File | null;
  time: string;
}

const LiveChat: React.FC = () => {
  const [isMeetStart, setIsMeetStart] = useState<boolean>(true);
  const [roomName] = useState<string>("your-room-name");
  const [chatOpen, setChatOpen] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch previous chat messages from an API if needed
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFile) {
      const message: ChatMessage = {
        sender: "Doctor",
        receiver: "Patient",
        message: newMessage,
        file: selectedFile,
        time: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
      setSelectedFile(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Video Call Section */}
      <Box sx={{ flex: 1, position: "relative", mb: 2 }}>
        {/* {isMeetStart && <JitsiMeetComponent roomName={roomName} />} */}
        {isMeetStart && <VideoConference/>}
      </Box>

      {/* Chat Section */}
      <Paper elevation={3} sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Chat Section</Typography>
          <IconButton onClick={() => setChatOpen(!chatOpen)}>
            <ArrowDropDownIcon />
          </IconButton>
        </Box>

        {chatOpen && (
          <Box sx={{ height: 300, overflowY: "auto", p: 1, border: "1px solid #ccc" }}>
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: msg.sender === "Doctor" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Paper sx={{ p: 1, maxWidth: "75%" }}>
                  <Typography variant="body2">
                    <strong>{msg.sender}</strong>: {msg.message}
                  </Typography>
                  {msg.file && <Typography variant="caption">{msg.file.name}</Typography>}
                  <Typography variant="caption" sx={{ display: "block", textAlign: "right" }}>
                    {msg.time}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        )}

        {/* Message Input & Attachments */}
        <Box display="flex" alignItems="center" mt={2}>
          <IconButton onClick={() => fileInputRef.current?.click()}>
            <AttachFileIcon />
          </IconButton>
          <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>
            <SendIcon />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LiveChat;
