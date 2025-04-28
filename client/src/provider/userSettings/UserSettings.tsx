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
import { navigate } from "wouter/use-browser-location";
import { toast } from 'sonner'

interface UserFormData {
  nameTitle: string;
  firstName: string;
  lastName: string;
  userName: string;
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  // Profile Form
  const {
    control: profileControl,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<UserFormData>({
    defaultValues: {
      nameTitle: 'DR',
      firstName: "",
      lastName: "",
      userName: "",
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

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     setSelectedFile(event.target.files[0]);
  //   }
  // };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  // const onSubmitProfile = async (data: UserFormData) => {
  //   console.log("Profile Data:", data);
  //   try{
  //    const response = await fetch("http://localhost:2000/api/v1/user/profile", {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       nameTitle: data.nameTitle,
  //       first: data.firstName,
  //       last: data.lastName,
  //       userName: data.userName,
  //       profileImage: selectedFile,
  //       email: data.email,
  //       phone: data.phone,
  //       designation: data.designation,
  //       medicalDegree: data.medicalDegree,
  //       newPassword: data.newPassword,
  //     }),
  //   });
  //   const result = await response.json();
  //   if (!response.ok || !result.success) {  
  //     console.error("Error updating profile:", result.message);
  //   } 
  //   }catch(error){
  //     console.error("Error uploading file:", error);
  //   }

  // };

  const onSubmitProfile = async (data: UserFormData) => {
    alert("Profile Data: " + JSON.stringify(data));
    console.log("Profile Data:", data);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    const formData = new FormData();
    formData.append("title", data.nameTitle);
    formData.append("first", data.firstName);
    formData.append("last", data.lastName);
    formData.append("username", data.userName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
      // formData.append("designation", data.designation);
      // formData.append("degree", data.medicalDegree);
    formData.append("password", data.newPassword);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }
    try {
      const response = await fetch("http://localhost:2000/api/v1/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error("Error updating profile:", result.message);
      } else {
        toast.success(result.message);
        console.log("Profile updated successfully:", result);
        navigate("/provider/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error uploading file:", error);
    }
  };
  // const onSubmitProfile = (data: UserFormData) => {
  //   console.log("Profile Data:", data);
  // };
  //   const token = localStorage.getItem("token");

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
          {/* <Tab label="Update Advice" /> */}
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
                          <MenuItem value='DR'>Dr</MenuItem>
                          <MenuItem value="Mr">Mr</MenuItem>
                          <MenuItem value="Mrs">Mrs</MenuItem>
                          <MenuItem value="Miss">Miss</MenuItem>
                          <MenuItem value="Ms">Ms</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="firstName"
                    control={profileControl}
                    rules={{ required: "FirstName is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Firstname"
                        fullWidth
                        error={!!profileErrors.firstName}
                        helperText={profileErrors.firstName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="lastName"
                    control={profileControl}
                    rules={{ required: "LastName is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Lastname"
                        fullWidth
                        error={!!profileErrors.lastName}
                        helperText={profileErrors.lastName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="userName"
                    control={profileControl}
                    rules={{ required: "UserName is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Username"
                        fullWidth
                        error={!!profileErrors.userName}
                        helperText={profileErrors.userName?.message}
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
                {/* <Grid item xs={12} md={6}>
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
                </Grid> */}

                {/* Medical Degree */}
                {/* <Grid item xs={12} md={6}>
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
                </Grid> */}

                {/* Profile Image */}
                <Grid item xs={12} md={6}>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    style={{ marginBottom: 8 }}
                  />

                  {previewUrl ? 
                   (
                    <div style={{ marginBottom: 8 }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #ccc',
                        }}
                      />
                    </div>
                  ) : (
                    <Typography>No file selected</Typography>
                  )}
                </Grid>

                  {/* {selectedFile ? (
                    <Typography>{selectedFile.name}</Typography>
                  ) : (
                    <Typography>No file selected</Typography>
                  )
                  
                  }
                </Grid> */}

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
        {/* {tabValue === 1 && (
          <Box sx={{ marginTop: 2 }}>
            <form onSubmit={handleAdviceSubmit(onSubmitAdvice)}>
              <Grid container spacing={2}>
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

                <Grid item xs={12}>
                  <Controller
                    name="notes"
                    control={adviceControl}
                    render={({ field }) => (
                      <TextField {...field} label="Additional Notes" multiline rows={3} fullWidth />
                    )}
                  />
                </Grid>

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
        )} */}
      </Paper>
    </MainLayout>
  );
};

export default UserSettings;
