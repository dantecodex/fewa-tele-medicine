import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, CircularProgress } from '@mui/material';
import MainLayout from '../../component/layout/MainLayout.tsx';

const PatientDashboard = () => {
  interface Meeting {
    id: string;
    meeting_id: string;
    topic: string;
    join_url: string;
    doctor: {
      first: string;
      last: string;
      email: string;
    };
    status: string;
  }

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch('http://localhost:2000/api/v1/patient/meeting', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Fetched meetings:', data);

        if (response.ok && data.success) {
          setMeetings(data.data);
        } else {
          console.error('Failed to fetch meetings:', data.message);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hello Patient 👋
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Meeting ID</b></TableCell>
                  <TableCell><b>Meeting Topic</b></TableCell>
                  <TableCell><b>Joining URL</b></TableCell>
                  <TableCell><b>Doctor Name</b></TableCell>
                  <TableCell><b>Doctor Email</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{meeting.meeting_id}</TableCell>
                    <TableCell>{meeting.topic}</TableCell>
                    <TableCell>
                      <Link href={meeting.join_url} target="_blank" rel="noopener">
                        Join Meeting
                      </Link>
                    </TableCell>
                    <TableCell>{meeting.doctor.first} {meeting.doctor.last}</TableCell>
                    <TableCell>{meeting.doctor.email}</TableCell>
                    <TableCell>{meeting.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </MainLayout>
  );
};

export default PatientDashboard;
