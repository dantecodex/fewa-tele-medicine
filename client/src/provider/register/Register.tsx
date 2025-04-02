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

const API_BASE_URL = "http://localhost:2000/api/v1";

// Validation Schemas
const signUpSchema = yup.object().shape({
  first: yup.string().required("First name is required"),
  last: yup.string().required("Last name is required"),
  phone: yup.string().required("Phone number is required"),
  username: yup.string().required("Username is required"),
  email: yup.string().required("Email is required").email("Invalid email address"),
  password: yup.string().required("Password is required"),
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
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [storedOtp, setStoredOtp] = useState(""); // Simulating OTP storage

// http://localhost:4200/ClientApp/#/ClientApp/patient/live

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

  const onSubmit = async (data) => {
    if (currentSection === "signUp") {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first: data.first,
            last: data.last,
            phone: data.phone,
            username: data.username,
            email: data.email,
            password: data.password,
          }),
        });
        const result = await response.json();
        if (result.success) {
          localStorage.setItem("regData", JSON.stringify(data));
          setEmail(data.email);
          setToken(result.token);
          setMessage("OTP has been sent to your email.");
          setCurrentSection("verifyOtpSection");
        } else {
          setMessage(result.message || "Signup failed.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
      }
    } else if (currentSection === "verifyOtpSection") {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({otp: data.otp }),
        });
        const result = await response.json();
        if (result.success) {
          console.log("OTP Verification Result:", result);
          // if (data.otp !== storedOtp) {
          //   setMessage("Invalid OTP. Please try again.");
          //   return;
          // }
          setMessage(result.message || "OTP verified successfully.");
          navigate("/provider/login");
          // setCurrentSection("showSetPasswordSection");
        } else {
          setMessage("Invalid OTP. Please try again.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
      }
    } else if (currentSection === "showSetPasswordSection") {
      try {
        const response = await fetch(`${API_BASE_URL}/set-password`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            adminEmail: data.adminEmail,
            password: data.password,
          }),
        });
        const result = await response.json();
        if (result.success) {
          setMessage("Account setup complete!");
          navigate("/provider/login");
        } else {
          setMessage("Failed to set password.");
        }
      } catch (error) {
        setMessage("An error occurred. Please try again.");
      }
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
                    <TextField fullWidth label="First Name" {...register("first")} error={!!errors.first} helperText={errors.first?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Last Name" {...register("last")} error={!!errors.last} helperText={errors.last?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Phone Number" {...register("phone")} error={!!errors.phone} helperText={errors.phone?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Username" {...register("username")} error={!!errors.username} helperText={errors.username?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email Address" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth type="password" label="Password" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
                  </Grid>
                  <Grid item xs={12}>
                   <Button type="submit" variant="contained" color="primary" fullWidth>Sign Up</Button>
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
