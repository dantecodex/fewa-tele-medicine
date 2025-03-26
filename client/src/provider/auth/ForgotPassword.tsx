import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "wouter";

// Validation Schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  otp: yup.string().when("showOtpVerifySection", {
    is: true,
    then: yup.string().required("OTP is required"),
  }),
  password: yup.string().when("showResetPasswordSection", {
    is: true,
    then: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  }),
  confirmPassword: yup.string().when("showResetPasswordSection", {
    is: true,
    then: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  }),
});

const ForgotPassword = () => {
  const [showOtpSection, setShowOtpSection] = useState(true);
  const [showOtpVerifySection, setShowOtpVerifySection] = useState(false);
  const [showResetPasswordSection, setShowResetPasswordSection] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handlers
  const sendOTP = () => {
    setShowOtpSection(false);
    setShowOtpVerifySection(true);
  };

  const verifyOTP = () => {
    setShowOtpVerifySection(false);
    setShowResetPasswordSection(true);
  };

  const resetPassword = () => {
    alert("Password Reset Successfully!");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ width: 400, p: 3 }}>
        <CardContent>
          {showOtpSection && (
            <>
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Forgot Password?
              </Typography>
              <Typography textAlign="center" mb={2}>
                Enter the email address associated with your account
              </Typography>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email Address"
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={sendOTP}
              >
                Send OTP
              </Button>
            </>
          )}

          {showOtpVerifySection && (
            <>
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Verify OTP
              </Typography>
              <Typography textAlign="center" mb={2}>
                Enter the OTP sent to your email
              </Typography>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Enter OTP"
                    fullWidth
                    margin="normal"
                    error={!!errors.otp}
                    helperText={errors.otp?.message}
                  />
                )}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={verifyOTP}
              >
                Confirm
              </Button>
              <Button variant="text" fullWidth sx={{ mt: 2 }}>
                Resend OTP
              </Button>
            </>
          )}

          {showResetPasswordSection && (
            <>
              <Typography variant="h5" fontWeight="bold" textAlign="center">
                Reset Password
              </Typography>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="New Password"
                    fullWidth
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Confirm Password"
                    fullWidth
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                onClick={resetPassword}
              >
                Submit
              </Button>
            </>
          )}

          <Typography textAlign="center" mt={2}>
            Back to Login?{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
