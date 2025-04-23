import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import VideoComponent from "../../helpers/testAudioVideo/TestAudioVideo.tsx";

interface PatientIntroProps {
  currentProvider: string;
}

const PatientIntro: React.FC<PatientIntroProps> = ({ currentProvider }) => {
  // State for form inputs
  const [patientName, setPatientName] = useState<string>("");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ patientName?: string; acceptTerms?: string }>({});
  const [loadConfigMsg, setLoadConfigMsg] = useState<boolean>(false);
  const [userLoggedMsg, setUserLoggedMsg] = useState<boolean>(false);
  const username = localStorage.getItem("userName")
  console.log(username)

  // Validate form
  const validateForm = () => {
    let newErrors: { patientName?: string; acceptTerms?: string } = {};
    if (!patientName.trim()) {
      newErrors.patientName = "Enter your name";
    }
    if (!acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const loginPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Patient logged in:", { patientName, acceptTerms });
      // Add API call or logic here
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome,
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please check in here to join your provider if you consent for this secure video visit.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Please check in below to let <b>{username}</b> know you are here.
        </Typography>

        <form onSubmit={loginPatient}>
          {/* Name Input */}
          <TextField
            fullWidth
            label="Enter your name"
            variant="outlined"
            margin="normal"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            error={!!errors.patientName}
            helperText={errors.patientName}
          />

          {/* Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                By clicking you will accept our <a href="#">Terms and Conditions</a>
              </Typography>
            }
          />
          {errors.acceptTerms && <Alert severity="error">{errors.acceptTerms}</Alert>}

          {/* Submit Button */}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" disabled={!acceptTerms} fullWidth>
              Submit
            </Button>
          </Box>

          {/* Error Messages */}
          {loadConfigMsg && <Alert severity="error">Cannot load configuration. Please talk with admin.</Alert>}
          {userLoggedMsg && <Alert severity="warning">User already logged in.</Alert>}
        </form>
      </Paper>

      {/* Video Preview Placeholder */}
      <Box mt={4}>
        <Typography variant="h5">Video Preview (Test Audio/Video Component)</Typography>
        <Box sx={{}}>
          <VideoComponent />
        </Box>
      </Box>
    </Container>
  );
};

export default PatientIntro;
