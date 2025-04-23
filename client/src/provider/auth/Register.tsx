import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { navigate } from "wouter/use-browser-location";
import { Link } from "wouter";

const Registration = () => {
  const [step, setStep] = useState("signUp");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmitSignUp = (data: any) => {
    console.log("Sign Up Data:", data);
    // Simulate OTP sending
    setOtpSent(true);
    setStep("verifyOtp");
  };

  const onSubmitOtp = (data: any) => {
    console.log("OTP Data:", data);
    if (data.otp !== "123456") {
      setErrorMessage("Invalid OTP. Please check again.");
      return;
    }
    setStep("setPassword");
  };

  const onSubmitPassword = (data: any) => {
    console.log("Password Data:", data);
    if (data.password !== data.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    } else
    navigate("/login");
    alert("Registration successful!");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h5">
          {step === "signUp"
            ? "Create an Account"
            : step === "verifyOtp"
            ? "Verify OTP"
            : "Set Password"}
        </Typography>
      </Box>

      {/* Step 1: Sign Up */}
      {step === "signUp" && (
        <form onSubmit={handleSubmit(onSubmitSignUp)}>
          <TextField
            fullWidth
            label="Practice Username"
            {...register("username", {
              required: "Practice username is required.",
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "No special characters allowed.",
              },
            })}
            margin="normal"
            error={!!errors.username}
            helperText={errors?.username?.message}
          />

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Invalid email address.",
              },
            })}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
          <Typography sx={{ mt: 2 }}>
            Already have an account? <Link href="/login">Sign In</Link>
          </Typography>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === "verifyOtp" && (
        <form onSubmit={handleSubmit(onSubmitOtp)}>
          <TextField
            fullWidth
            label="Enter OTP"
            {...register("otp", { required: "OTP is required." })}
            margin="normal"
            error={!!errors.otp}
            helperText={errors.otp?.message}
          />

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Confirm OTP
          </Button>
        </form>
      )}

      {/* Step 3: Set Password */}
      {step === "setPassword" && (
        <form onSubmit={handleSubmit(onSubmitPassword)}>
          <TextField
            fullWidth
            label="Admin Email"
            type="email"
            {...register("adminEmail", {
              required: "Admin email is required.",
            })}
            margin="normal"
            error={!!errors.adminEmail}
            helperText={errors.adminEmail?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required.",
            })}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password is required.",
              validate: (value) =>
                value === watch("password") || "Passwords must match.",
            })}
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      )}
    </Container>
  );
};

export default Registration;
