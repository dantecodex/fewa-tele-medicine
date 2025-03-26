import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  InputAdornment,
  Box,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CallIcon from "@mui/icons-material/Call";
import SendIcon from "@mui/icons-material/Send";
import "./Chat.scss";
import MainLayout from "../../component/layout/MainLayout.tsx";


const Chat = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const chatContainerRef = useRef(null);

  // Mock data for users
  const users = [
    { id: 1, name: "John Doe", image: "" },
    { id: 2, name: "Jane Smith", image: "" },
    { id: 3, name: "Saurabh Jain", image: "" },
    { id: 4, name: "Gaurabh", image: "" },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUserSelect = (user) => {
    setCurrentChatUser(user);
    setMessages((prev) => ({
      ...prev,
      [user.name]: prev[user.name] || [],
    }));
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && currentChatUser) {
      const updatedMessages = {
        ...messages,
        [currentChatUser.name]: [
          ...(messages[currentChatUser.name] || []),
          { sender: "Me", message: newMessage, time: new Date().toLocaleTimeString() },
        ],
      };
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop().toLowerCase();
    if (!["jpg", "png", "jpeg", "pdf"].includes(fileExt)) {
      alert("Only JPG, PNG, and PDF files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB.");
      return;
    }

    setSelectedFile(file);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      setMessages((prev) => ({
        ...prev,
        [currentChatUser.name]: [
          ...(prev[currentChatUser.name] || []),
          {
            sender: "Me",
            file: reader.result,
            fileName: file.name,
            time: new Date().toLocaleTimeString(),
          },
        ],
      }));
    };
    reader.readAsDataURL(file);
  };
  const handleCallUser = () => {
    if (currentChatUser) {
      alert(`Calling ${currentChatUser.name}...`);
      // later will replace this with actual call logic using WebRTC or a signaling service.
    } else {
      alert("No user selected for calling.");
    }
  };
  

  return (
    <MainLayout>
    <Box>

      {/* Chat Section */}
      <Box display="flex">
        {/* Sidebar */}
        <Paper sx={{ width: "30%", height: "100vh", padding: 2 }}>
          {/* Search Bar */}
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Chat List */}
          <List>
            {users
              .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((user) => (
                <ListItem
                  key={user.id}
                  button
                  selected={currentChatUser?.id === user.id}
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar src={user.image || "/assets/img/profilePic.jpg"} />
                  <ListItemText primary={user.name} sx={{ marginLeft: 2 }} />
                </ListItem>
              ))}
          </List>
        </Paper>

        {/* Chat Window */}
        <Paper sx={{ flex: 1, height: "90vh", display: "flex", flexDirection: "column" }}>
          {currentChatUser ? (
            <>
              {/* Chat Header */}
              <Box display="flex" alignItems="center" padding={2} borderBottom="1px solid #ccc">
                <Avatar src={currentChatUser.image || "/assets/img/profilePic.jpg"} />
                <Typography variant="h6" sx={{ marginLeft: 2, flexGrow: 1 }}>
                  {currentChatUser.name}
                </Typography>
                <IconButton>
                  <CallIcon onClick={handleCallUser}/>
                </IconButton>
              </Box>

              {/* Chat Messages */}
              <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
                {messages[currentChatUser.name]?.map((msg, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={msg.sender === "Me" ? "flex-end" : "flex-start"}
                    marginBottom={1}
                  >
                    <Paper sx={{ padding: 1, maxWidth: "60%", borderRadius: 2 }}>
                      {msg.message && <Typography variant="body2">{msg.message}</Typography>}
                      {msg.file && (
                        <a href={msg.file} download={msg.fileName}>
                          <Typography variant="body2" color="primary">
                            {msg.fileName}
                          </Typography>
                        </a>
                      )}
                      <Typography variant="caption" display="block" align="right">
                        {msg.time}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                <div ref={chatContainerRef} />
              </Box>

              {/* Message Input */}
              <Box display="flex" padding={4} borderTop="1px solid #ccc">
                <Box sx={{marginTop:2}}>
                  <input type="file" hidden id="uploadFile" onChange={handleFileChange} />
                  <label htmlFor="uploadFile">📎</label>
                </Box>
                <TextField
                  variant="outlined"
                  fullWidth
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Typography variant="h6" align="center" sx={{ marginTop: "20vh" }}>
              Select a user to start chatting
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
    </MainLayout>
  );
};

export default Chat;
