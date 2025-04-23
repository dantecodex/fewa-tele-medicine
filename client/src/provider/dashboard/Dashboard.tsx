import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  CircularProgress,
  Chip,
  Select,
} from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import MainLayout from "../../component/layout/MainLayout.tsx";
import "./Dashboard.scss";

type Meeting = {
  id: number;
  meeting_id: string;
  topic: string;
  status: string;
  patient: {
    first: string;
    last: string;
    email: string;
    phone: string;
  };
};

const Dashboard = () => {
  const providerUserName = localStorage.getItem("userName") || '""';
  const [patients, setPatients] = useState<{ first: string; last: string; email: string; phone: string; id: number }[]>([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [savingStatusMeetingId, setSavingStatusMeetingId] = useState(null);

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
        console.log('Fetched doctor meetings successfully');
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


  useEffect(() => {
    fetchDoctorMeetings();
  }, []);


  const handleStartMeeting = (patientId) => {
    navigate(`/provider/video_conference/${patientId}`);
  };


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
        setPatients(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleStatusChange = async (selectedStatus, meetingId) => {
    const token = localStorage.getItem('accessToken');
    setSavingStatusMeetingId(meetingId);

    try {
      const response = await fetch(`http://localhost:2000/api/v1/doctor/meeting/${selectedStatus}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ meetingId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Status updated successfully');
        setMeetings(prevMeetings =>
          prevMeetings.map(meeting =>
            meeting.meeting_id === meetingId
              ? { ...meeting, status: selectedStatus }
              : meeting
          )
        );
      } else {
        console.error('Failed to update status:', data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setSavingStatusMeetingId(null);
    }
  };

  const renderStatusChip = (status) => {
    if (status === 'COMPLETED') {
      return <Chip label="Completed" color="success" size="small" />;
    } else if (status === 'PENDING') {
      return <Chip label="Pending" color="warning" size="small" />;
    } else {
      return <Chip label={status} size="small" />;
    }
  };


  return (
    <MainLayout>
      <Grid container spacing={3} p={3}>

        {/* Welcome Section */}
        <Grid item xs={14} md={10}>
          <Card>
            <CardContent>
              <Grid container alignItems="center">
                <img src="/assets/img/dashboard.png" alt="Dashboard" style={{ width: 100, marginRight: 20 }} />
                <Typography variant="h5">Hello! {JSON.parse(providerUserName || '""')}</Typography>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Invitation Form */}
        {/* <Grid item xs={14} md={10}>
        <Card>
          <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                onClick={copyToClipboard}
                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
              >
                Click Here To Copy Invitation Link
              </Typography>
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
      </Grid> */}

        {/* Completed Appointments Table */}
        <Grid item xs={14} md={10}>
          <Card>
            <CardContent>
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6"> All Appointments</Typography>
              </Grid>
              {loading ? (
                <CircularProgress />
              ) : (
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
                      {meetings.map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell>{meeting.meeting_id}</TableCell>
                          <TableCell>{meeting.topic}</TableCell>
                          <TableCell>{meeting.patient.first} {meeting.patient.last}</TableCell>
                          <TableCell>{meeting.patient.email}</TableCell>
                          <TableCell>{meeting.patient.phone}</TableCell>
                          <TableCell>
                            {savingStatusMeetingId === meeting.id ? (
                              <CircularProgress size={24} />
                            ) : (
                              <Select
                                value={meeting.status}
                                onChange={(e) => handleStatusChange(e.target.value, meeting.meeting_id,)}
                                size="small"
                                sx={{ minWidth: 120 }}
                                renderValue={(selected) => renderStatusChip(selected)}
                              >
                                <MenuItem value="PENDING">
                                  <Chip label="Pending" color="warning" size="small" />
                                </MenuItem>
                                <MenuItem value="COMPLETED">
                                  <Chip label="Completed" color="success" size="small" />
                                </MenuItem>
                                <MenuItem value="CANCELLED">
                                  <Chip label="Cancelled" color="error" size="small" />
                                </MenuItem>
                              </Select>

                            )}
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>

                  </Table>
                </TableContainer>
              )}
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
                        <TableCell>{patient?.first}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="primary" onClick={() => handleStartMeeting(patient.id)}> + Schedule a Meeting</Button>
                        </TableCell>
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
