import React, { useState } from "react";
import {
    Box, Typography, TextField, Checkbox, FormControlLabel, Select, MenuItem, Button, IconButton, Paper
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useForm, Controller } from "react-hook-form";
import MainLayout from "../../component/layout/MainLayout.tsx";

// Define TypeScript types
interface ReportFormValues {
    labOrdersSent: boolean;
    newPrescriptionsSentToYourPharmacy: boolean;
    newPrescriptionsMailedToYou: boolean;
    medication: string;
    followUpNumber: number;
    followUpMeasure: string;
}

const Report: React.FC = () => {
    const [formData, setFormData] = useState({
        labOrdersSent: false,
        newPrescriptionsSentToYourPharmacy: false,
        newPrescriptionsMailedToYou: false,
        medication: "",
        followUpNumber: "",
        followUpMeasure: "Weekly",
    });
    const [newMessage, setNewMessage] = useState("");

    const [notifications, setNotifications] = useState<boolean>(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: "Dana White", message: "Hello, provider", time: "8.18AM" },
        { sender: "You", message: "Hello Dana White", time: "8.18AM" },
        { sender: "You", message: "How can I help you?", time: "8.19AM" },
    ]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const toggleNotifications = () => {
        setNotifications(!notifications);
    };

    const handleSubmit = () => {
        console.log("Submitted Data:", formData);
    };
    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            setChatMessages([...chatMessages, { sender: "You", message: newMessage, time: new Date().toLocaleTimeString() }]);
            setNewMessage("");
        }
    };

    return (
        <MainLayout>
        <Box display="flex" width="100%">
            {/* Left Section: Video + After Visit Summary */}
            <Box flex={3} p={2}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h5">After Visit Summary</Typography>
                    <Box component="form">
                        <FormControlLabel
                            control={<Checkbox checked={formData.labOrdersSent} onChange={handleChange} name="labOrdersSent" />}
                            label="Lab Orders Sent"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={formData.newPrescriptionsSentToYourPharmacy} onChange={handleChange} name="newPrescriptionsSentToYourPharmacy" />}
                            label="New prescriptions sent to your pharmacy"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={formData.newPrescriptionsMailedToYou} onChange={handleChange} name="newPrescriptionsMailedToYou" />}
                            label="New prescriptions mailed to you"
                        />
                        <TextField
                            label="Advice"
                            multiline
                            rows={4}
                            fullWidth
                            name="medication"
                            value={formData.medication}
                            onChange={handleChange}
                        />
                        <Box display="flex" gap={1} marginTop={"25px"}>
                            <TextField
                                type="number"
                                label="Follow Up in"
                                name="followUpNumber"
                                value={formData.followUpNumber}
                                onChange={handleChange}
                            />
                            <Select name="followUpMeasure" value={formData.followUpMeasure} onChange={handleChange}>
                                <MenuItem value="Weekly">Weekly</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Yearly">Yearly</MenuItem>
                            </Select>
                        </Box>
                        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: "10px" }}>
                            Complete Visit
                        </Button>

                    </Box>
                </Paper>
            </Box>

            {/* Right Section: Notifications & Chat */}
            <Box flex={1} p={2} sx={{ borderLeft: "1px solid #ddd" }}>
                {/* Notification Button */}
                <IconButton onClick={toggleNotifications}>
                    <NotificationsIcon color={notifications ? "primary" : "default"} />
                </IconButton>

                {/* Notification Panel */}
                {notifications && (
                    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                        <Typography variant="h6">Notifications</Typography>
                        <Typography variant="body2">Matt Hardy waiting for your call - 12:00 PM</Typography>
                    </Paper>
                )}

                {/* Chat Section */}
                <Box mt={3}>
                    <Typography variant="h6">Chat Section</Typography>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">Direct Message with @Dana White</Typography>
                        <Box mt={2}>
                            {chatMessages.map((msg, index) => (
                                <Box key={index} display="flex" flexDirection="column" alignItems={msg.sender === "Provider" ? "flex-end" : "flex-start"} mb={1}>
                                    <Typography variant="body2" fontWeight="bold">{msg.sender}</Typography>
                                    <Paper sx={{ p: 1, bgcolor: msg.sender === "Provider" ? "primary.light" : "grey.200", maxWidth: "80%" }}>
                                        {msg.message}
                                    </Paper>
                                    <Typography variant="caption">{msg.time}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Message Input */}
                        <Box mt={2} display="flex" gap={1}>
                            {/* <TextField fullWidth variant="outlined" placeholder="Type a message..." /> */}
                            <TextField 
                            fullWidth 
                            variant="outlined" 
                            value={newMessage} 
                            onChange={(e) => setNewMessage(e.target.value)} 
                            placeholder="Type a message..." 
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button variant="contained" color="primary" onClick={handleSendMessage}>Send</Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
        </MainLayout>
    );
};

export default Report;
