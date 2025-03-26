import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Box,
} from "@mui/material";

// Define TypeScript interfaces
interface Patient {
  name: string;
  url: string;
  practice: string;
  providerNameAttending: string;
}

interface Practice {
  logoPath?: string;
}

const PatientIntro: React.FC = () => {
  const navigate = useNavigate();
  const [practice, setPractice] = useState<Practice>({});
  const [loadConfigMsg, setLoadConfigMsg] = useState<boolean>(false);
  const [userLoggedMsg, setUserLoggedMsg] = useState<boolean>(false);

  // React Hook Form
  const {
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { patientName: "", acceptTerms: true },
  });

  const acceptTerms = watch("acceptTerms");

  // Simulated global object
  const global = {
    currentProvider: "Dr. Smith",
    currentPractice: "HealthCareCenter",
    practiceUrl: "https://api.example.com/",
    config: { videourl: "https://video.example.com/PROVIDERNAME" },
  };

  useEffect(() => {
    getPractice();
  }, []);

  const getPractice = async () => {
    const key = "73l3M3D"; // Hardcoded key
    try {
      const response = await axios.get(
        `${global.practiceUrl}GetPracticeConfiguration?practice=${global.currentPractice}&key=${key}`
      );
      const data = response.data;
      setPractice({ logoPath: data.logoPath || "/assets/img/logo.png" });
    } catch (error) {
      setLoadConfigMsg(true);
      setTimeout(() => setLoadConfigMsg(false), 5000);
    }
  };

  const loginPatient = async (data: { patientName: string; acceptTerms: boolean }) => {
    if (!data.patientName) {
      setError("patientName", { type: "manual", message: "Enter your name" });
      return;
    }
    if (!data.acceptTerms) {
      setError("acceptTerms", { type: "manual", message: "You must accept the terms." });
      return;
    }

    const patient: Patient = {
      name: data.patientName,
      url: global.currentProvider,
      practice: global.currentPractice.replace(/\s/g, "").toLowerCase(),
      providerNameAttending: global.currentProvider.replace(/\s/g, "").toLowerCase(),
    };

    try {
      const response = await axios.post(`${global.practiceUrl}LoginPatient`, patient);
      sessionStorage.setItem("PatientName", response.data.User.name);

      let url = global.config.videourl.replace("PROVIDERNAME", global.currentProvider);
      global.config.videourl = url;

      navigate("/patient/live");
    } catch (error) {
      setUserLoggedMsg(true);
      setTimeout(() => setUserLoggedMsg(false), 5000);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4">Welcome,</Typography>
        <Typography variant="body1">
          Please check in here to join your provider if you consent for this secure video visit.
        </Typography>
        <Typography variant="h6">
          Please check in below to let <b>{global.currentProvider}</b> know you are here.
        </Typography>

        <form onSubmit={handleSubmit(loginPatient)}>
          {/* Patient Name Input */}
          <Controller
            name="patientName"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                label="Enter your name"
                variant="outlined"
                margin="normal"
                {...field}
                error={!!errors.patientName}
                helperText={errors.patientName?.message}
              />
            )}
          />

          {/* Terms and Conditions Checkbox */}
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} color="primary" />}
                label="By clicking you accept our Terms and Conditions"
              />
            )}
          />
          {errors.acceptTerms && <Alert severity="error">{errors.acceptTerms.message}</Alert>}

          {/* Submit Button */}
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={!acceptTerms}>
              Submit
            </Button>
          </Box>
        </form>

        {/* Error Messages */}
        {loadConfigMsg && <Alert severity="error">Cannot load configuration. Please talk with admin.</Alert>}
        {userLoggedMsg && <Alert severity="warning">User already logged in.</Alert>}
      </Paper>
    </Container>
  );
};

export default PatientIntro;
