import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";
import SearchIcon from "@mui/icons-material/Search";
// import { useHistory } from "react-router-dom"; // To navigate if needed
import MainLayout from "../../component/layout/MainLayout.tsx";
// const tokenHeader = socket.handshake.headers?.auth (Bearer sjdbnfksdjfksjdfkjsdfjk)
 
// Assuming token is stored in localStorage
const token = localStorage.getItem("accessToken");
const socket = io("http://localhost:2000", {
  auth: {
    token: token, // Sending token for authentication
  },
});

interface Patient {
  id: number;
  first: string;
  image: string;
}

const Chat = () => {
  const [currentChatUser, setCurrentChatUser] = useState<Patient | null>(null);
  interface Message {
    senderId: string;
    text: string;
    roomId: string;
  }
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const chatContainerRef = useRef(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [patients, setPatients] = useState<Patient[]>([]);
   const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


   const getPatientList = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch("http://localhost:2000/api/v1/patient/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setCurrentChatUser(data[0]?.id); // Set the first patient as the default chat user
      console.log("Fetched patients API", data);
      return data;
    } catch (error) {
      console.error("Error fetching patient list:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatientList();
        console.log("API Response:", response);
        // setPatients(response.data);
        setPatients(
          response.data.map((p) => ({
            ...p,
            name: `${p.first} ${p.last || ""}`.trim(),
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatients();
  }, []);

  // Handle the message from the server
  useEffect(() => {
    socket.on("private_message", (message) => {
      // Check if the message's roomId matches the current room
      if (message.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off("private_message"); // Cleanup the listener
    };
  }, [roomId]);

  // Join room when selecting a user
  const handleUserSelect = (user) => {
    const userData = localStorage.getItem("loginData") || '""';
    const docid = userData?.id;
    console.log("docid", docid)
    console.log(userData)
    localStorage.setItem("l", JSON.stringify(user));
    console.log("22", user.id)
    setCurrentChatUser(user);
    const newRoomId = `room-${user.id}`; // Example roomId could be based on user.id
    setRoomId(newRoomId);
    console.log("New Room ID:", newRoomId);
    socket.emit("join", { roomId: newRoomId });
  };

  // Send message to server
  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && currentChatUser) {
      const messageData = {
        roomId: roomId,
        text: newMessage,
        receiverId: currentChatUser?.id, // Ensure currentChatUser is not null
      };
      console.log("Message Data:", messageData);
      socket.emit("private_message", messageData); // Emit message to the server
      if (roomId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { senderId: "Me", text: newMessage, roomId },
        ]);
      }
      setNewMessage("");
    }
  };

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <MainLayout>
      <Box>
        {/* Chat Section */}
        <Box display="flex">
          {/* Sidebar (for selecting users) */}
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
            {patients
              .filter((user) => user.first.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((user) => (
                <ListItem
                  key={user.id}
                  button
                  selected={currentChatUser?.id === user.id}
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar src={user.image || "/assets/img/profilePic.jpg"} />
                  <ListItemText primary={user.first} sx={{ marginLeft: 2 }} />
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
                    {/* <CallIcon /> */}
                  </IconButton>
                </Box>

                {/* Chat Messages */}
                <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
                  {messages.map((msg, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent={msg.senderId === "Me" ? "flex-end" : "flex-start"}
                      marginBottom={1}
                    >
                      <Paper sx={{ padding: 1, maxWidth: "60%", borderRadius: 2 }}>
                        <Typography variant="body2">{msg.text}</Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={chatContainerRef} />
                </Box>

                {/* Message Input */}
                <Box display="flex" padding={2} borderTop="1px solid #ccc">
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
