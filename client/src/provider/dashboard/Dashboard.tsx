import React, { useState } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Avatar,
  InputAdornment,
  IconButton,
  Snackbar
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Dashboard.scss";
import { navigate } from "wouter/use-browser-location";
import MainLayout from "../../component/layout/MainLayout.tsx";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [patients] = useState([
    { name: "John Doe", status: 0 },
    { name: "Jane Smith", status: 1 },
  ]);
  const [appointments] = useState([
    { date: "March 10, 2025", startTime: "10:00 AM", endTime: "10:30 AM", duration: "30 min" },
    { date: "March 11, 2025", startTime: "11:00 AM", endTime: "11:20 AM", duration: "20 min" },
  ]);

  const [open, setOpen] = useState(false);
  
  const invitationLink = "https://yourapp.com/invite?code=123456"; // Replace with dynamic link

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink)
      .then(() => setOpen(true)) // Show success message
      .catch(err => console.error("Failed to copy: ", err));
  };

  const providerObj = { nameTitle: "Dr.", name: "John Doe", image: "" };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const sendInvitation = () => {
    alert("Invitation sent to patient successfully!");
    console.log("Sending invitation to", email || phone);
  };

  const openChat = () => {
    console.log("Chat button clicked");   
    navigate("/provider/chat");
  }
  const openVideo=()=>{
    console.log("Video button clicked");
    navigate("/provider/video_conference");
  }

  return (
    <MainLayout>
    <Grid container spacing={3} p={3}>
      {/* Header */}
      {/* <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Dashboard</Typography>
          <div>
            <Button onClick={handleMenuOpen} startIcon={<Avatar src={providerObj.image || "/assets/img/profilePic.jpg"} />}>
              {providerObj.nameTitle} {providerObj.name}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </div>
        </Grid>
      </Grid> */}

      {/* Welcome Section */}
      <Grid item xs={14} md={10}>
        <Card>
          <CardContent>
            <Grid container alignItems="center">
              <img src="/assets/img/dashboard.png" alt="Dashboard" style={{ width: 100, marginRight: 20 }} />
              <Typography variant="h5">Hello! {providerObj.nameTitle} {providerObj.name}</Typography>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Invitation Form */}
      <Grid item xs={14} md={10}>
        <Card>
          <CardContent>
            {/* <Typography variant="h6" gutterBottom>Click Here To Copy Invitation Link</Typography> */}
              <Typography
                variant="h6"
                gutterBottom
                onClick={copyToClipboard}
                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
              >
                Click Here To Copy Invitation Link
              </Typography>

              {/* Snackbar for confirmation */}
              <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                message="Invitation link copied!"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4}>
                <TextField label="Email address" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
              </Grid>
              <Grid item xs={1}>
                <Typography variant="body1" align="center">OR</Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField label="Phone number" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" color="primary" onClick={sendInvitation}>Send</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Completed Appointments Table */}
      <Grid item xs={14} md={10}>
        <Card>
          <CardContent>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Completed Appointments</Typography>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Call Start Time</TableCell>
                    <TableCell>Call End Time</TableCell>
                    <TableCell>Duration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appt, index) => (
                    <TableRow key={index}>
                      <TableCell>{appt.date}</TableCell>
                      <TableCell>{appt.startTime}</TableCell>
                      <TableCell>{appt.endTime}</TableCell>
                      <TableCell>{appt.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Patients List */}
      <Grid item xs={14} md={10}>
        <Card>
          <CardContent>
            <Typography variant="h6">Patients</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {patients.map((patient, index) => (
                    <TableRow key={index}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {/* {patient.status === 0 && ( */}
                          <Button variant="contained" color="primary" onClick={openVideo}>Call</Button>
                        {/* )} */}
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="secondary" onClick={openChat}>Chat</Button>
                      </TableCell>
                      {/* Call Button - Renders only if temp.status === 0 && temp.name exists */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </MainLayout>
  );
};

export default Dashboard;
