import React, { useEffect, useState } from 'react';
import {
  Avatar, Box, Button, Grid, Link, Tab, Tabs, Typography, ToggleButtonGroup, ToggleButton, FormControlLabel, RadioGroup, Radio, Switch,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Chip,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { toast } from 'sonner'
import MainLayout from '../../component/layout/MainLayout.tsx';

const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '9:00 AM : 10:00 AM', '10:00 AM : 11:00 AM', '11:00 AM : 12:00 PM',
  '12:00 PM : 1:00 PM', '1:00 PM : 2:00 PM', '2:00 PM : 3:00 PM',
  '3:00 PM : 4:00 PM', '4:00 PM : 5:00 PM', '5:00 PM : 6:00 PM',
  '6:00 PM : 7:00 PM', '7:00 PM : 8:00 PM', '8:00 PM : 9:00 PM'
];

const DoctorProfile: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState('Saturday');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [addSwitch, setAddSwitch] = useState(false);
  const [mode, setMode] = useState<'Online' | 'Offline'>('Online');

  const weekDays = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '9:00 AM : 10:00 AM', '10:00 AM : 11:00 AM', '11:00 AM : 12:00 PM',
    '12:00 PM : 1:00 PM', '1:00 PM : 2:00 PM', '2:00 PM : 3:00 PM',
    '3:00 PM : 4:00 PM', '4:00 PM : 5:00 PM', '5:00 PM : 6:00 PM',
    '6:00 PM : 7:00 PM', '7:00 PM : 8:00 PM', '8:00 PM : 9:00 PM'
  ];

  const [loading, setLoading] = useState(true);

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

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    setSelectedTimeSlots([]); // Reset selected time slots when switching day
  };

  const handleSlotToggle = (slot: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };



  const handleAddTimeSlot = async () => {
    if (selectedTimeSlots.length === 0) return;

    const token = localStorage.getItem('accessToken');
    const weekday = selectedDay.toUpperCase(); // e.g., "MONDAY"

    const payload = selectedTimeSlots.map((slot) => {
      // Example slot: "9:00 AM : 10:00 AM"
      const [start, end] = slot.split(' : ');
      const startTime = new Date();
      const endTime = new Date();

      // Parse times (assumes local timezone, convert to UTC later)
      const [startHour, startMinutePart] = start.split(':');
      const startMinutes = startMinutePart?.includes('AM') || startMinutePart?.includes('PM')
        ? parseInt(startMinutePart)
        : 0;
      const isStartPM = start.toLowerCase().includes('pm');
      const startHour24 = (parseInt(startHour) % 12) + (isStartPM ? 12 : 0);

      const [endHour, endMinutePart] = end.split(':');
      const endMinutes = endMinutePart?.includes('AM') || endMinutePart?.includes('PM')
        ? parseInt(endMinutePart)
        : 0;
      const isEndPM = end.toLowerCase().includes('pm');
      const endHour24 = (parseInt(endHour) % 12) + (isEndPM ? 12 : 0);

      startTime.setHours(startHour24, startMinutes, 0, 0);
      endTime.setHours(endHour24, endMinutes, 0, 0);

      return {
        weekday,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        mode: mode.toUpperCase(), // ONLINE or ONSITE
      };
    });

    try {
      const res = await fetch('http://localhost:2000/api/v1/doctor/time-slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit time slots');

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
      }
      console.log('Time slots saved:', result);

      // Optional: reset slots
      setSelectedTimeSlots([]);
    } catch (error) {
      console.error('Error submitting time slots:', error);
    }
  };


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleEditProfile = () => console.log('Edit Profile clicked');
  const handleChangePassword = () => console.log('Change Password clicked');
  const handleSignOut = () => console.log('Sign Out clicked');
  const handleAppointments = () => console.log('My Appointments clicked');

  const userInfo = {
    firstName: '', lastName: '', phoneNumber: '', email: '', dob: '', gender: '',
    residenceCountry: '', specialization: '', languages: ['Arabic', 'English'], price30: '', price60: ''
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
      <Box sx={{ display: 'flex', gap: 4, p: 4, bgcolor: '#f4f5f7' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, bgcolor: 'white', p: 2, borderRadius: 2, width: '220px' }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: '#5e17eb' }}>
            <PersonIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="subtitle1" color="textSecondary">Dr.</Typography>
          <Button variant="contained" sx={{ bgcolor: '#5e17eb', textTransform: 'none' }} onClick={handleAppointments}>My Appointments</Button>
        </Box>

        <Box sx={{ flexGrow: 1, maxWidth: 'calc(100% - 260px)' }}>
          <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="Personal Info" />
              <Tab label="Time Slots" />
              <Tab label="Pending Requests" />
            </Tabs>

            <Box sx={{ mt: 3 }}>
              {tabIndex === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>First Name</b></Typography><Typography>{userInfo.firstName || '-'}</Typography>
                    <Typography><b>Last Name</b></Typography><Typography>{userInfo.lastName || '-'}</Typography>
                    <Typography><b>Phone Number</b></Typography><Typography>{userInfo.phoneNumber || '-'}</Typography>
                    <Typography><b>Email</b></Typography><Typography>{userInfo.email || '-'}</Typography>
                    <Typography><b>Date Of Birth</b></Typography><Typography>{userInfo.dob || '-'}</Typography>
                    <Typography><b>Gender</b></Typography><Typography>{userInfo.gender || '-'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><b>Residence Country</b></Typography><Typography>{userInfo.residenceCountry || '-'}</Typography>
                    <Typography><b>Specialization</b></Typography><Typography>{userInfo.specialization || '-'}</Typography>
                    <Typography><b>Languages</b></Typography><Typography>{userInfo.languages.join(', ')}</Typography>
                    <Typography><b>30 Minutes Price</b></Typography><Typography>{userInfo.price30 || '-'}</Typography>
                    <Typography><b>60 Minutes Price</b></Typography><Typography>{userInfo.price60 || '-'}</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Link component="button" underline="none" sx={{ color: 'green', fontWeight: 'bold' }} onClick={handleEditProfile}>
                        <EditIcon fontSize="small" sx={{ mr: 0.5 }} />Edit Profile
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Button variant="outlined" color="success" onClick={handleChangePassword}>Change Password</Button>
                      <Button variant="outlined" color="error" onClick={handleSignOut}>Sign Out</Button>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {tabIndex === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    {weekDays.map((day) => (
                      <Button
                        key={day}
                        variant={selectedDay === day ? 'contained' : 'outlined'}
                        onClick={() => handleDayClick(day)}
                        sx={{
                          width: '100%',
                          mb: 1,
                          textTransform: 'capitalize',
                          bgcolor: selectedDay === day ? '#5e17eb' : 'white',
                          color: selectedDay === day ? 'white' : 'black',
                          '&:hover': {
                            bgcolor: selectedDay === day ? '#4b0fc4' : '#f0f0f0',
                          },
                        }}
                      >
                        {day}
                      </Button>
                    ))}
                    <Box mt={2}>
                      <Button variant="outlined" fullWidth onClick={handleAddTimeSlot}>
                        Add
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      {timeSlots.map((slot) => (
                        <Grid item xs={12} sm={6} md={4} key={slot}>
                          <Button
                            variant={selectedTimeSlots.includes(slot) ? 'contained' : 'outlined'}
                            onClick={() => handleSlotToggle(slot)}
                            sx={{
                              width: '100%',
                              height: 60,
                              textTransform: 'none',
                              bgcolor: selectedTimeSlots.includes(slot) ? '#00c781' : '#f0f0f0',
                              color: selectedTimeSlots.includes(slot) ? 'white' : '#555',
                              '&:hover': {
                                bgcolor: selectedTimeSlots.includes(slot) ? '#00a76f' : '#ddd',
                              },
                            }}
                          >
                            {slot}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>

                    <Box display="flex" alignItems="center" mt={4} gap={2} flexWrap="wrap">
                      <Box>
                        <Typography variant="body1">
                          <Radio
                            checked={mode === 'Online'}
                            onChange={() => setMode('Online')}
                            value="Online"
                            name="radio-buttons"
                            color="primary"
                          />
                          Online
                          <Radio
                            checked={mode === 'Offline'}
                            onChange={() => setMode('Offline')}
                            value="Offline"
                            name="radio-buttons"
                            color="primary"
                            sx={{ ml: 2 }}
                          />
                          Offline
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center">
                        <Typography variant="body1" sx={{ mr: 1 }}>Add</Typography>
                        <Switch checked={addSwitch} onChange={() => setAddSwitch(!addSwitch)} color="success" />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}


              {tabIndex === 2 && <Typography>

                <Grid item xs={14} md={10}>
                  <Card>
                    <CardContent>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Typography variant="h6"> Doctor Pending Appointments</Typography>
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
                                  <TableCell>{renderStatusChip(meeting.status)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Typography>}
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DoctorProfile;
