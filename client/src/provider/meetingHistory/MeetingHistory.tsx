// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Avatar,
//   Menu,
//   MenuItem,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import MainLayout from "../../component/layout/MainLayout.tsx";

// const MeetingHistory = ({ providerObj }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // Dropdown handlers
//   const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   // Date change handlers
//   const handleStartDateChange = (event) => setStartDate(event.target.value);
//   const handleEndDateChange = (event) => setEndDate(event.target.value);

//   // Static Data for Testing
//   const completedAppointments = [
//     {
//       appointmentDate: "2025-03-15",
//       startTime: "2025-03-15T09:30:00",
//       endTime: "2025-03-15T09:50:00",
//     },
//     {
//       appointmentDate: "2025-03-16",
//       startTime: "2025-03-16T11:00:00",
//       endTime: "2025-03-16T11:30:00",
//     },
//     {
//       appointmentDate: "2025-03-20",
//       startTime: "2025-03-20T10:00:00",
//       endTime: "2025-03-20T10:20:00",
//     },
//   ];

//   // **Fixed: Date Filtering with Proper Comparison**
//   const filteredAppointments = completedAppointments.filter((appointment) => {
//     const appointmentDate = new Date(appointment.appointmentDate); // Convert to Date Object
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     return (
//       (!start || appointmentDate >= start) && // Include if no start date OR within range
//       (!end || appointmentDate <= end) // Include if no end date OR within range
//     );
//   });

//   console.log("Start Date:", startDate);
//   console.log("End Date:", endDate);
//   console.log("Filtered Appointments:", filteredAppointments);

//   const difference = (startTime, endTime) => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);
//     const diffInSeconds = (end - start) / 1000;
//     const minutes = Math.floor(diffInSeconds / 60);
//     const seconds = diffInSeconds % 60;
//     return `${minutes}m ${seconds}s`;
//   };

//   return (
//     <MainLayout>
//     <Box display="flex">
//       {/* Sidebar */}
//       {/* <Sidebar /> */}

//       {/* Main Content */}
//       <Box flex={1} p={3}>
//         {/* Header */}
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h4">Meeting History</Typography>
//           <Box display="flex" alignItems="center">
//           </Box>
//         </Box>

//         {/* Completed Appointments */}
//         <Box mt={4}>
//           <Typography variant="h5">Completed Appointments</Typography>

//           {/* Date Range Picker */}
//           <Box display="flex" justifyContent="flex-end" mt={2} mb={2} gap={2}>
//             <TextField
//               label="Start Date"
//               type="date"
//               value={startDate}
//               onChange={handleStartDateChange}
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               label="End Date"
//               type="date"
//               value={endDate}
//               onChange={handleEndDateChange}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Box>

//           {/* Table */}
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Date</TableCell>
//                   <TableCell>Call Start Time</TableCell>
//                   <TableCell>Call End Time</TableCell>
//                   <TableCell>Duration</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredAppointments.length > 0 ? (
//                   filteredAppointments.map((temp, index) => (
//                     <TableRow key={index}>
//                       <TableCell>{new Date(temp.appointmentDate).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}</TableCell>
//                       <TableCell>{new Date(temp.startTime).toLocaleTimeString()}</TableCell>
//                       <TableCell>{new Date(temp.endTime).toLocaleTimeString()}</TableCell>
//                       <TableCell>{difference(temp.startTime, temp.endTime)}</TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={4} align="center">
//                       No Appointments Found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </Box>
//     </Box>
//     </MainLayout>
//   );
// };

// export default MeetingHistory;

import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,CircularProgress, Chip } from '@mui/material';
// import TablePagination from '@mui/material/TablePagination';
import MainLayout from '../../component/layout/MainLayout.tsx';

const MeetingHistory = () => {
  interface Meeting {
    id: string;
    meeting_id: string;
    topic: string;
    patient: {
      first: string;
      last: string;
      email: string;
      phone: string;
    };
    status: string;
  }

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Slice meetings for current page
  const paginatedMeetings = meetings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );


  const renderStatusChip = (status) => {
    if (status === 'COMPLETED') {
      return <Chip label="Completed" color="success" size="small" />;
    } else if (status === 'PENDING') {
      return <Chip label="Pending" color="warning" size="small" />;
    } else {
      return <Chip label={status} size="small" />;
    }
  };

  useEffect(() => {
    const fetchDoctorMeetings = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch('http://localhost:2000/api/v1/doctor/meeting', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setMeetings(data.data);
        } else {
          console.error('Failed to fetch doctor meetings:', data.message);
        }
      } catch (error) {
        console.error('Error fetching doctor meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorMeetings();
  }, []);

  return (
    <MainLayout>
       <Container maxWidth="lg" sx={{ mt: 4 }}>
    <Typography variant="h4" gutterBottom>
      Doctor Meeting History 📋
    </Typography>

    {loading ? (
      <CircularProgress />
    ) : (
      <>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Meeting ID</b></TableCell>
                <TableCell><b>Topic</b></TableCell>
                <TableCell><b>Patient Name</b></TableCell>
                <TableCell><b>Patient Email</b></TableCell>
                <TableCell><b>Patient Phone</b></TableCell>
                <TableCell><b>Status</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{meeting.meeting_id}</TableCell>
                  <TableCell>{meeting.topic}</TableCell>
                  <TableCell>{meeting.patient.first} {meeting.patient.last}</TableCell>
                  <TableCell>{meeting.patient.email}</TableCell>
                  <TableCell>{meeting.patient.phone}</TableCell>
                  <TableCell>{renderStatusChip(meeting.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <TablePagination
          component="div"
          count={meetings.length}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </>
    )}
  </Container>
    </MainLayout>
  );
};

export default MeetingHistory

