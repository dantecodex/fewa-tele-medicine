import React, { useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import MainLayout from "../../component/layout/MainLayout.tsx";

interface UserFormData {
  nameTitle: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  medicalDegree: string;
  profileImage?: File;
  newPassword: string;
}

interface AdviceFormData {
  diagnosis: string;
  treatment: string;
  notes: string;
}

const UserSettings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Profile Form
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<UserFormData>({
    defaultValues: {
      nameTitle: "Dr.",
      name: "",
      email: "",
      phone: "",
      designation: "",
      medicalDegree: "",
      newPassword: "",
    },
  });

  // Advice Form
  const {
    control: adviceControl,
    handleSubmit: handleAdviceSubmit,
    formState: { errors: adviceErrors },
    reset: resetAdvice,
  } = useForm<AdviceFormData>({
    defaultValues: {
      diagnosis: "",
      treatment: "",
      notes: "",
    },
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onSubmitProfile = (data: UserFormData) => {
    console.log("Profile Data:", data);
  };

  const onSubmitAdvice = (data: AdviceFormData) => {
    console.log("Advice Data:", data);
  };

  return (
    <MainLayout>
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Update Profile" />
        <Tab label="Update Advice" />
      </Tabs>

      {/* Profile Form */}
      {tabValue === 0 && (
        <Box sx={{ marginTop: 2 }}>
          <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
            <Grid container spacing={2}>
              {/* Name */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Title</InputLabel>
                  <Controller
                    name="nameTitle"
                    control={profileControl}
                    render={({ field }) => (
                      <Select {...field}>
                        <MenuItem value="Dr.">Dr.</MenuItem>
                        <MenuItem value="Mr.">Mr.</MenuItem>
                        <MenuItem value="Mrs.">Mrs.</MenuItem>
                        <MenuItem value="Miss.">Miss.</MenuItem>
                        <MenuItem value="Ms.">Ms.</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={profileControl}
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Full Name"
                      fullWidth
                      error={!!profileErrors.name}
                      helperText={profileErrors.name?.message}
                    />
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={profileControl}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      error={!!profileErrors.email}
                      helperText={profileErrors.email?.message}
                    />
                  )}
                />
              </Grid>

               {/* Contact No. */}
               <Grid item xs={12} md={6}>
                <Controller
                  name="phone"
                  control={profileControl}
                  rules={{
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10,14}$/,
                      message: "Invalid contact number",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Contact No."
                      fullWidth
                      error={!!profileErrors.phone}
                      helperText={profileErrors.phone?.message}
                    />
                  )}
                />
              </Grid>

              {/* Designation */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="designation"
                  control={profileControl}
                  rules={{ required: "Designation is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Designation"
                      fullWidth
                      error={!!profileErrors.designation}
                      helperText={profileErrors.designation?.message}
                    />
                  )}
                />
              </Grid>

              {/* Medical Degree */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="medicalDegree"
                  control={profileControl}
                  rules={{ required: "Medical degree is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Medical Degree"
                      fullWidth
                      error={!!profileErrors.medicalDegree}
                      helperText={profileErrors.medicalDegree?.message}
                    />
                  )}
                />
              </Grid>

              {/* Profile Image */}
              <Grid item xs={12} md={6}>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  style={{ marginBottom: 8 }}
                />
                {selectedFile && <Typography>{selectedFile.name}</Typography>}
              </Grid>

              {/* Reset Password */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="newPassword"
                  control={profileControl}
                  render={({ field }) => (
                    <TextField {...field} label="Reset Password" type="password" fullWidth />
                  )}
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12} textAlign="right">
                <Button onClick={() => resetProfile()} variant="outlined" sx={{ marginRight: 2 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}

      {/* Advice Form */}
      {tabValue === 1 && (
        <Box sx={{ marginTop: 2 }}>
          <form onSubmit={handleAdviceSubmit(onSubmitAdvice)}>
            <Grid container spacing={2}>
              {/* Diagnosis */}
              <Grid item xs={12}>
                <Controller
                  name="diagnosis"
                  control={adviceControl}
                  rules={{ required: "Diagnosis is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Diagnosis"
                      fullWidth
                      error={!!adviceErrors.diagnosis}
                      helperText={adviceErrors.diagnosis?.message}
                    />
                  )}
                />
              </Grid>

              {/* Treatment */}
              <Grid item xs={12}>
                <Controller
                  name="treatment"
                  control={adviceControl}
                  rules={{ required: "Treatment is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Treatment"
                      fullWidth
                      error={!!adviceErrors.treatment}
                      helperText={adviceErrors.treatment?.message}
                    />
                  )}
                />
              </Grid>

              {/* Additional Notes */}
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={adviceControl}
                  render={({ field }) => (
                    <TextField {...field} label="Additional Notes" multiline rows={3} fullWidth />
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} textAlign="right">
                <Button onClick={() => resetAdvice()} variant="outlined" sx={{ marginRight: 2 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Advice
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      )}
    </Paper>
    </MainLayout>
  );
};

export default UserSettings;
