import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Container,
} from "@mui/material";
import { navigate } from "wouter/use-browser-location";

// Validation Schemas
const signUpSchema = yup.object().shape({
  name: yup.string().required("Practice username is required"),
  email: yup.string().required("Email is required").email("Invalid email address"),
});

const otpSchema = yup.object().shape({
  otp: yup.string().required("One-time password is required"),
});

const passwordSchema = yup.object().shape({
  adminEmail: yup.string().required("Admin Email is required").email("Invalid email address"),
  password: yup.string().required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

const Registration = () => {
  const [currentSection, setCurrentSection] = useState("signUp");
  const [message, setMessage] = useState("");
  const [storedOtp, setStoredOtp] = useState(""); // Simulating OTP storage

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      currentSection === "signUp"
        ? signUpSchema
        : currentSection === "verifyOtpSection"
        ? otpSchema
        : passwordSchema
    ),
  });

  const onSubmit = (data: any) => {
    if (currentSection === "signUp") {
      console.log("Sign Up Data:", data);
      localStorage.setItem("registrationData", JSON.stringify(data));
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setStoredOtp(generatedOtp); // Store OTP
      console.log("Generated OTP (for testing):", generatedOtp);
      setMessage("Your OTP has been sent to your email.");
      setCurrentSection("verifyOtpSection");
    } else if (currentSection === "verifyOtpSection") {
      if (data.otp !== storedOtp) {
        setMessage("Invalid OTP. Please try again.");
        return;
      }
      setMessage("");
      setCurrentSection("showSetPasswordSection");
    } else if (currentSection === "showSetPasswordSection") {
      console.log("Final Registration Data:", data);
      setMessage("Account setup complete!");
      navigate("/provider/login");
    }
  };

  const resendOtp = () => {
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setStoredOtp(newOtp);
    console.log("New OTP (for testing):", newOtp);
    setMessage("A new OTP has been sent to your email.");
  };

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Box textAlign="center" mb={2}>
              <img src="/assets/img/stethoscope.png" alt="Stethoscope" style={{ width: 60 }} />
            </Box>

            <Typography variant="h5" textAlign="center">
              {currentSection === "signUp" && "SIGN UP FOR FREE"}
            </Typography>

            <Typography variant="h4" textAlign="center" mb={3}>
              {currentSection === "signUp" && "Create an account"}
              {currentSection === "verifyOtpSection" && "Verify OTP"}
              {currentSection === "showSetPasswordSection" && "Set Admin Email & Password"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/* Step 1: Signup Form */}
                {currentSection === "signUp" && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Practice Username"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign Up
                      </Button>
                    </Grid>
                  </>
                )}

                {/* Step 2: OTP Verification */}
                {currentSection === "verifyOtpSection" && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="One-Time Password (OTP)"
                        {...register("otp")}
                        error={!!errors.otp}
                        helperText={errors.otp?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Confirm OTP
                      </Button>
                    </Grid>

                    <Grid item xs={12}>
                      <Button variant="outlined" color="secondary" fullWidth onClick={resendOtp}>
                        Resend OTP
                      </Button>
                    </Grid>
                  </>
                )}

                {/* Step 3: Set Admin Email & Password */}
                {currentSection === "showSetPasswordSection" && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Admin Email"
                        {...register("adminEmail")}
                        error={!!errors.adminEmail}
                        helperText={errors.adminEmail?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label="Confirm Password"
                        {...register("confirm_password")}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Submit
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </form>

            {message && (
              <Typography color="success.main" textAlign="center" mt={2}>
                {message}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Right Side - Info Section */}
        <Grid item xs={12} md={6} className="intro-about">
          <Box className="intro-content" textAlign="center">
            <Box className="into-logo">
              <img src="/assets/img/logo.png" alt="Practice Logo" className="img-fluid" />
            </Box>
            <Box className="intro-bannercontent" mt={2}>
              <Typography>Welcome to the demo of Fewa. This is the place where you can put your practice description.</Typography>
              <ul>
                <li>
                  <span>📞</span>
                  <Typography>987654321</Typography>
                </li>
                <li>
                  <span>📧</span>
                  <Typography>dummy@gmail.com</Typography>
                </li>
              </ul>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Registration;
