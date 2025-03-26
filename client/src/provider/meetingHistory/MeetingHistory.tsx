import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import MainLayout from "../../component/layout/MainLayout.tsx";
// import Sidebar from "./Sidebar";
// import profilePicPlaceholder from "/assets/img/profilePic.jpg"; // Placeholder image

const MeetingHistory = ({ providerObj }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Dropdown handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  // Date change handlers
  const handleStartDateChange = (event) => setStartDate(event.target.value);
  const handleEndDateChange = (event) => setEndDate(event.target.value);

  // Static Data for Testing
  const completedAppointments = [
    {
      appointmentDate: "2025-03-15",
      startTime: "2025-03-15T09:30:00",
      endTime: "2025-03-15T09:50:00",
    },
    {
      appointmentDate: "2025-03-16",
      startTime: "2025-03-16T11:00:00",
      endTime: "2025-03-16T11:30:00",
    },
    {
      appointmentDate: "2025-03-20",
      startTime: "2025-03-20T10:00:00",
      endTime: "2025-03-20T10:20:00",
    },
  ];

  // **Fixed: Date Filtering with Proper Comparison**
  const filteredAppointments = completedAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate); // Convert to Date Object
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    return (
      (!start || appointmentDate >= start) && // Include if no start date OR within range
      (!end || appointmentDate <= end) // Include if no end date OR within range
    );
  });

  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  console.log("Filtered Appointments:", filteredAppointments);

  const difference = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInSeconds = (end - start) / 1000;
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <MainLayout>
    <Box display="flex">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <Box flex={1} p={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Meeting History</Typography>
          <Box display="flex" alignItems="center">
          </Box>
        </Box>

        {/* Completed Appointments */}
        <Box mt={4}>
          <Typography variant="h5">Completed Appointments</Typography>

          {/* Date Range Picker */}
          <Box display="flex" justifyContent="flex-end" mt={2} mb={2} gap={2}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Table */}
          <TableContainer component={Paper}>
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
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((temp, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(temp.appointmentDate).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}</TableCell>
                      <TableCell>{new Date(temp.startTime).toLocaleTimeString()}</TableCell>
                      <TableCell>{new Date(temp.endTime).toLocaleTimeString()}</TableCell>
                      <TableCell>{difference(temp.startTime, temp.endTime)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No Appointments Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
    </MainLayout>
  );
};

export default MeetingHistory;
