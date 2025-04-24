import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import MainLayout from '../../component/layout/MainLayout.tsx';
import { timezones } from '../../helpers/utils/TimeZones.js';
import { time } from '../../helpers/utils/TimeZones.js';
import { DateTime } from 'luxon';

const ScheduleMeeting = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [hour, setHour] = useState('2');
  const [ampm, setAmpm] = useState('AM');
  const [timezone, setTimezone] = useState('');
  const [passcode, setPasscode] = useState('AHHC9Y');
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [hostVideo, setHostVideo] = useState(true);
  const [participantVideo, setParticipantVideo] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [showDescriptionField, setShowDescriptionField] = useState(false);
  const [description, setDescription] = useState('');
  interface MeetingDetails {
    topic: string;
    agenda?: string;
    start_time: string;
    timezone: string;
    id: string | number;
    attendees?: string;
    join_url: string;
    year: string
  }

  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
  const [topic, setTopic] = useState('My Meeting');

  // console.log("startDate", startDate);

  const pathParts = window.location.pathname.split("/");

  const patientId = pathParts[pathParts.length - 1];

  console.log('meetingDetails', meetingDetails);

  const scheduleMeeting = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      const [selectedHourStr, selectedMinuteStr] = hour.split(":");
      let hourNum = parseInt(selectedHourStr);
      const minuteNum = parseInt(selectedMinuteStr);

      // Correctly handle AM/PM
      if (ampm === "PM" && hourNum < 12) {
        hourNum += 12;
      }
      if (ampm === "AM" && hourNum === 12) {
        hourNum = 0;
      }

      const [year, month, day] = startDate.split("-").map(Number);

      // Now create datetime in selected timezone
      const meetingTime = DateTime.fromObject(
        {
          year: year,
          month: month,
          day: day,
          hour: hourNum,
          minute: minuteNum,
        },
        { zone: timezone }
      );
      // Convert it to UTC
      const isoStartTime = meetingTime?.toString()?.replace(/\.\d{3}[+-]\d{2}:\d{2}$/, "");

      console.log("Final start_time (corrected):", isoStartTime);


      const response = await fetch("http://localhost:2000/api/v1/zoom/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: topic,
          description: description,
          timezone: timezone,   // keep selected timezone
          start_time: isoStartTime, // corrected start time
          userId: Number(patientId),
        }),
      });

      const result = await response.json();
      console.log("Zoom API Response:", result);
      if (result.success && result.data) {
        setMeetingDetails(result.data);
        localStorage.setItem("meetingStarted", "true");
      } else {
        alert("Failed to create Zoom meeting.");
        console.error("Zoom API Error:", result.message);
      }
    } catch (error) {
      console.error("Zoom API Fetch Error:", error);
      alert("An error occurred while starting the meeting.");
    }
  };

const formateDate = (isoString: string,timeZone) => {
  if (!isoString) {
    return "N/A"
  }

  const date: Date = new Date(isoString);

  const formattedDate: string = date.toLocaleString("en-US", {
    month: "short",       
    day: "numeric",       
    year: "numeric",      
    hour: "numeric",      
    minute: "2-digit",    
    hour12: true,
    timeZone       
  });

  return formattedDate?.replace(/,(?=[^,]*$)/, "");
};

  return (
    <MainLayout>
      {!meetingDetails && <Box p={4} maxWidth={600} mx="auto">
        <Typography variant="h5" gutterBottom>
          Schedule Meeting
        </Typography>

        <TextField
          label="Topic"
          fullWidth
          margin="normal"
          value={topic}               // controlled input
          onChange={(e) => setTopic(e.target.value)} // update state
        />

        {!showDescriptionField && <Button onClick={() => setShowDescriptionField(true)} sx={{ mt: 1 }}>
          + Add Description
        </Button>}
        {showDescriptionField && (
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 1 }}
          />
        )}
        <Box mt={2}>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box mt={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Time</InputLabel>
                <Select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  label="Time"
                >
                  {time.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                {/* <InputLabel>AM/PM</InputLabel> */}
                <Select value={ampm} onChange={(e) => setAmpm(e.target.value)}>
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Grid item mt={3} xs={12}>
          <FormControl fullWidth>
            <InputLabel>Time Zone</InputLabel>
            <Select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              label="Time Zone"
            >
              {Object.entries(timezones).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* <Box mt={2}>
          <TextField
            label="Attendees"
            placeholder="Enter user names or email addresses"
            fullWidth
            margin="normal"
          />
        </Box>

        <Typography variant="subtitle1" mt={4} mb={1}>
          Meeting ID
        </Typography>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Generate Automatically" />
        <FormControlLabel control={<Checkbox />} label="Personal Meeting ID 702 737 4262" /> */}

        <Box mt={4} display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={scheduleMeeting}>
            Save
          </Button>
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>}


      {meetingDetails && (
        <Box mt={6} p={3} border="1px solid #ccc" borderRadius={2}>
          <Typography variant="h4" gutterBottom>
            Meeting Details
          </Typography>
          <Box mt={2}>
            <Typography><strong>Topic:</strong> {meetingDetails.topic}</Typography>
          </Box>
          <Box mt={2}>
            <Typography><strong>Description:</strong> {meetingDetails.agenda || 'N/A'}</Typography>
          </Box>
          {/* <Typography><strong>Time:</strong> {new Date(meetingDetails.start_time).toLocaleString('en-US', { timeZone: meetingDetails.timezone })}</Typography> */}
          <Box mt={2}>
            <Typography>
              <strong>Time:</strong> {`${meetingDetails?.start_time} (${meetingDetails?.timezone})`}
            </Typography>
          </Box>


          <Box mt={2}>
            <Typography><strong>Meeting ID:</strong> {meetingDetails.id}</Typography>
          </Box>
          <Box mt={2}>
            <Typography><strong>Attendees:</strong> {meetingDetails.attendees || 'N/A'}</Typography>
          </Box>
          <Box mt={2}>
            <Typography>
              <strong>Invite Link:</strong>{" "}
              <a href={meetingDetails.join_url} target="_blank" rel="noopener noreferrer">
                {meetingDetails.join_url}
              </a>
            </Typography>
          </Box>
          <Box mt={4}>
            <Button variant="contained" color="primary" href={meetingDetails.join_url} target="_blank">
              Start
            </Button>
          </Box>
        </Box>
      )}

    </MainLayout>
  );
};

export default ScheduleMeeting;
