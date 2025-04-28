import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, CircularProgress,
  Chip, Box, TextField, InputAdornment,
} from '@mui/material';
import MainLayout from '../../component/layout/MainLayout.tsx';
import SearchIcon from '@mui/icons-material/Search';
import { format, parseISO, isSameDay } from 'date-fns';

const MeetingHistory = () => {
  interface Meeting {
    id: string;
    meeting_id: string;
    topic: string;
    start_time: string; // Added this (important for sorting)
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
  const [searchPatient, setSearchPatient] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const renderStatusChip = (status: string) => {
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
          // Sort by start_time ascending (earliest first)
          const sortedData = data.data.sort((a: Meeting, b: Meeting) => {
            return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
          });
          setMeetings(sortedData);
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

  // Filter logic
  const filteredMeetings = meetings.filter((meeting) => {
    const patientFullName = `${meeting.patient.first} ${meeting.patient.last}`.toLowerCase();
    const matchesPatient = patientFullName.includes(searchPatient.toLowerCase());
    const matchesDate = filterDate
      ? isSameDay(parseISO(meeting.start_time), filterDate)
      : true;
    return matchesPatient && matchesDate;
  });

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
          <Typography variant="h4">Doctor Meeting History 📋</Typography>


          {/* Filters */}
          <Box display="flex" gap={2} mt={3}>
            <TextField
              label="Search Patient Name"
              variant="outlined"
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Filter by Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={filterDate ? format(filterDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const selectedDate = e.target.value ? new Date(e.target.value) : null;
                setFilterDate(selectedDate);
              }}
            />
          </Box>
        </Box>


        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer
              component={Paper}
              sx={{
                mt: 4,
                maxHeight: 500, // Table scroll
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Meeting ID</b></TableCell>
                    <TableCell><b>Date</b></TableCell>
                    <TableCell><b>Topic</b></TableCell>
                    <TableCell><b>Patient Name</b></TableCell>
                    <TableCell><b>Patient Email</b></TableCell>
                    <TableCell><b>Patient Phone</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.meeting_id}</TableCell>
                      <TableCell>{format(parseISO(meeting.start_time), 'dd MMM yyyy hh:mm a')}</TableCell>
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
          </>
        )}
      </Container>
    </MainLayout>
  );
};

export default MeetingHistory;
