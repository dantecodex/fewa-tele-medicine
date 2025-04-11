import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";


// Validation Schema
const schema = yup.object().shape({
  email_username: yup.string().required("Email is required").email("Invalid email address"),
  otp: yup.string().when("step", {
    is: 2,
    then: yup.string().required("OTP is required"),
  }),
  password: yup.string().when("step", {
    is: 3,
    then: yup.string().required("Password is required"),
  }),
  confirm_password: yup.string().when("step", {
    is: 3,
    then: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required"),
  }),
});
const API_BASE_URL = "http://localhost:2000/api/v1";
const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState({ otpSent: "", otpError: "", resetError: "" });
  const [email, setEmail] = useState("");
  const [resetPasswordToken, setResetPasswordToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });



  // Function to send OTP
  const sendOTP = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email_username }),
      });

      const result = await response.json();
      console.log("OTP API Response:", result);

      if (result.success) {
        setEmail(data.email_username);
        toast.success(result?.message || "OTP sent successfully");
        setStep(2);
      } else {
        setMessages(prev => ({ ...prev, otpError: result.message || "Failed to send OTP" }));
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred. Please try again.");
      console.error("OTP API Error:", error);
    }
  };


  // Function to verify OTP
  const verifyOTP = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password?otp=${data.otp}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ otp: data.otp }),
      });

      const result = await response.json();
      console.log("Verify OTP API Response:", result);
      if (result.success) {
        console.log("resetToken:", result);
        setResetPasswordToken(result?.data?.resetPasswordToken);
        toast.success(result?.message || "OTP verified successfully");
        setStep(3);
      } else {
        // setMessages({ ...messages, otpError: result.message || "Invalid OTP" });
        toast.error(result?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred. Please try again.");
    }
  };

  // Function to reset password
  const resetPassword = async (data: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: data.password, resetPasswordToken: resetPasswordToken }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result?.message || "Password reset successfully");
        setMessages(result.message);
        setStep(1);
      } else {
        setMessages({ ...messages, resetError: result.message || "Failed to reset password" });
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred. Please try again.");
      setMessages({ ...messages, resetError: "An error occurred. Please try again." });
    }
  };

  // Handle form submission
  const onSubmit = (data: any) => {
    if (step === 1) {
      sendOTP(data);
    } else if (step === 2) {
      verifyOTP(data);
    } else if (step === 3) {
      resetPassword(data);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        toast.success(result?.message || "OTP resent successfully");
      } else {
        toast.error(result.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred while resending OTP.");
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>

        {/* Left Side - Forgot Password Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Box textAlign="center" mb={2}>
              <img src="/assets/img/stethoscope.png" alt="Stethoscope" style={{ width: 60 }} />
            </Box>

            <Typography variant="h5" textAlign="center">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Your Password"}
            </Typography>

            <Typography variant="h6" textAlign="center" mb={3}>
              {step === 1 && "Enter the email address associated with your account"}
              {step === 1 && "We will email you a link to reset the password"}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/* Step 1: Email Input */}
                {step === 1 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Enter your email address or username"
                        {...register("email_username")}
                        error={!!errors.email_username}
                        helperText={errors.email_username?.message}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Send
                      </Button>
                    </Grid>
                  </>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Enter your One-Time Password (OTP)"
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

                {/* Step 3: Reset Password */}
                {step === 3 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="Enter your new password"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={togglePasswordVisibility} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirm your password"
                        {...register("confirm_password")}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Submit
                      </Button>
                    </Grid>
                  </>
                )}


                {/* Back to Login */}
                <Grid item xs={12} textAlign="center">
                  <Typography>
                    Back to Login? <a href="/provider/login">Sign In</a>
                  </Typography>
                </Grid>

                {/* Messages */}
                {messages.otpSent && (
                  <Typography color="success.main" textAlign="center" mt={2}>
                    {messages.otpSent}
                  </Typography>
                )}
                {messages.otpError && (
                  <Typography color="error.main" textAlign="center" mt={2}>
                    {messages.otpError}
                  </Typography>
                )}
                {messages.resetError && (
                  <Typography color="success.main" textAlign="center" mt={2}>
                    {messages.resetError}
                  </Typography>
                )}
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Right Side - Info Section */}
        <Grid item xs={12} md={6} className="intro-about">
          <Box className="intro-content" textAlign="center">
            <Box className="into-logo">
              <img src="/assets/img/logo.png" alt="Practice Logo" className="img-fluid" />
            </Box>
            <Box className="intro-bannercontent" mt={2}>
              <Typography>
                Welcome to the demo of Fewa. This is the place where you can put your practice
                description. Fewa is an application that helps connect providers and patients via
                video.
              </Typography>
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

export default ForgotPassword;
