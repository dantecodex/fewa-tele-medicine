import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  TextField,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MainLayout from "../../component/layout/MainLayout.tsx";

// Validation Schemas
const configSchema = yup.object().shape({
  hospital_name: yup.string().required("Practice name is required."),
  hospital_contact: yup
    .string()
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Invalid contact number.")
    .required("Practice contact is required."),
  hospital_email: yup
    .string()
    .email("Invalid email address.")
    .required("Email is required."),
  hospital_description: yup.string().optional(),
});

const providerSchema = yup.object().shape({
  userName: yup.string().required("User Name is required."),
  email: yup.string().email("Invalid email").required("User Email is required."),
  password: yup.string().required("Password is required."),
});

const AdminSettings: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [emailContent, setEmailContent] = useState(
    "<p>This is your current email template...</p>"
  );
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Form Hook for Configuration Tab
  const {
    control: configControl,
    handleSubmit: handleConfigSubmit,
    reset: resetConfig,
    formState: { errors: configErrors, isValid: isConfigValid },
  } = useForm({
    resolver: yupResolver(configSchema),
    mode: "onChange",
  });

  // Form Hook for Provider Tab
  const {
    control: providerControl,
    handleSubmit: handleProviderSubmit,
    reset: resetProvider,
    formState: { errors: providerErrors, isValid: isProviderValid },
  } = useForm({
    resolver: yupResolver(providerSchema),
    mode: "onChange",
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      if (!["image/png", "image/jpg", "image/jpeg"].includes(uploadedFile.type)) {
        setFileError("Upload only image files (PNG, JPG, JPEG).");
        return;
      }
      if (uploadedFile.size > 2 * 1024 * 1024) {
        setFileError("Please upload file less than 2MB.");
        return;
      }
      setFile(uploadedFile);
      setFileError(null);
    }
  };

  // Submit Handlers
  const onConfigSubmit = (data: any) => {
    console.log("Config Form Data:", data);
  };

  const onProviderSubmit = (data: any) => {
    console.log("Provider Form Data:", data);
  };

  const onEmailTemplateSubmit = () => {
    console.log("Email Template Updated");
  };

  const handleEditTemplate = () => {
    setIsEditing(true);
  };

  const handlePreviewTemplate = () => {
    if (editorRef.current) {
      setEmailContent(editorRef.current.innerHTML);
    }
    setIsEditing(false);
  };

  return (
    <MainLayout>
    <Box sx={{ width: "100%", padding: 3 }}>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="admin settings tabs">
        <Tab label="Configuration" />
        <Tab label="Edit Invitation Email Template" />
        <Tab label="Add Provider" />
      </Tabs>

      <Box sx={{ padding: 2 }}>
        {/* Configuration Tab */}
        {tabIndex === 0 && (
          <Paper sx={{ padding: 3, marginTop: 2 }}>
            <Typography variant="h5">Update Practice Configuration</Typography>
            <form onSubmit={handleConfigSubmit(onConfigSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="hospital_name"
                    control={configControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Practice Name"
                        fullWidth
                        error={!!configErrors.hospital_name}
                        helperText={configErrors.hospital_name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="hospital_contact"
                    control={configControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Practice Contact No."
                        fullWidth
                        placeholder="(999) 999-9999"
                        error={!!configErrors.hospital_contact}
                        helperText={configErrors.hospital_contact?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="hospital_email"
                    control={configControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Practice Email"
                        fullWidth
                        error={!!configErrors.hospital_email}
                        helperText={configErrors.hospital_email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography>Practice Logo</Typography>
                  <input type="file" accept="image/png, image/jpg, image/jpeg" onChange={handleFileChange} />
                  {file && <Typography>{file.name}</Typography>}
                  {fileError && <Typography color="error">{fileError}</Typography>}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="hospital_description"
                    control={configControl}
                    render={({ field }) => (
                      <TextField {...field} label="Practice Description" fullWidth multiline rows={4} />
                    )}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <Button variant="outlined" onClick={() => resetConfig()} sx={{ marginRight: 1 }}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={!isConfigValid}>
                  Save
                </Button>
              </Box>
            </form>
          </Paper>
        )}

        {/* Edit Invitation Email Template Tab */}
        {tabIndex === 1 && (
        //   <Paper sx={{ padding: 3, marginTop: 2 }}>
        //     <Typography variant="h5">Update Email Configuration</Typography>
        //     <Typography>Edit your email template here...</Typography>
        //     <Button variant="contained" onClick={onEmailTemplateSubmit} sx={{ marginTop: 2 }}>
        //       Save
        //     </Button>
        //   </Paper>
        <Box sx={{ padding: 2 }}>
        {/* Email Template Tab */}
        {tabIndex === 1 && (
          <Paper sx={{ padding: 3, marginTop: 2 }}>
            <Typography variant="h5">Update Email Configuration</Typography>

            <Box sx={{ border: "1px solid black", marginTop: 2, padding: 2 }}>
              {/* Editable Content */}
              <Box
                ref={editorRef}
                contentEditable={isEditing}
                dangerouslySetInnerHTML={{ __html: emailContent }}
                sx={{
                  minHeight: "100px",
                  padding: "10px",
                  background: "#f9f9f9",
                  border: isEditing ? "1px solid #ccc" : "none",
                  outline: "none",
                }}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                {!isEditing ? (
                  <Button variant="outlined" onClick={handleEditTemplate} sx={{ marginRight: 1 }}>
                    ✏️ Edit Template
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handlePreviewTemplate}>
                    👁️ Preview Changes
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
        )}

        {/* Add Provider Tab */}
        {tabIndex === 2 && (
          <Paper sx={{ padding: 3, marginTop: 2 }}>
            <Typography variant="h5">Add Provider</Typography>
            <form onSubmit={handleProviderSubmit(onProviderSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="userName"
                    control={providerControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="User Name"
                        fullWidth
                        error={!!providerErrors.userName}
                        helperText={providerErrors.userName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="email"
                    control={providerControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="User Email"
                        fullWidth
                        error={!!providerErrors.email}
                        helperText={providerErrors.email?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="password"
                    control={providerControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="password"
                        label="Password"
                        fullWidth
                        error={!!providerErrors.password}
                        helperText={providerErrors.password?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <Button variant="outlined" onClick={() => resetProvider()} sx={{ marginRight: 1 }}>
                  Reset
                </Button>
                <Button variant="contained" type="submit" disabled={!isProviderValid}>
                  Save
                </Button>
              </Box>
            </form>
          </Paper>
        )}
      </Box>
    </Box>
    </MainLayout>
  );
};

export default AdminSettings;
