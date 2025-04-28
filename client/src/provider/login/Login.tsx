import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Paper,
} from "@mui/material";
import "./Login.scss";
import { navigate } from "wouter/use-browser-location";
import { toast } from 'sonner'

const Login = () => {
  type FormState = {
    providerUserName: string;
    providerPassword: string;
  };

  const [form, setForm] = useState<FormState>({
    providerUserName: "",
    providerPassword: "",
  });

  const API_BASE_URL = "http://localhost:2000/api/v1";

  const [errors, setErrors] = useState<{ providerUserName?: string; providerPassword?: string; apiError?: string }>({});

  const validate = () => {
    let tempErrors: { providerUserName?: string; providerPassword?: string; apiError?: string } = {};
    if (!form.providerUserName) tempErrors.providerUserName = "Username is required";
    if (!form.providerPassword) tempErrors.providerPassword = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.providerUserName,
          password: form.providerPassword,
        }),
      });

      const result = await response.json();
      localStorage.setItem("loginData", JSON.stringify(result?.data));
  console.log("result login",result);
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed. Please try again.");
      }

      const { role, accessToken, } = result.data;
      toast.success(result.message);
      localStorage.setItem("role", role);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userName", JSON.stringify(form.providerUserName));

      // Redirect based on role
      switch (role) {
        case "DOCTOR":
          navigate("/provider/dashboard");
          break;
        case "PATIENT":
          navigate("/patient/home");
          break;
        default:
          throw new Error("Unauthorized role. Please contact support.");
      }

    } catch (error) {
      toast.error(error.message);
      setErrors({ apiError: error.message });
    }
  };



  return (
    <Container maxWidth="lg" >
      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        {/* Left Side - Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Box textAlign="center" mb={2}>
              <img src="/assets/img/stethoscope.png" alt="Stethoscope" style={{ width: 60 }} />
            </Box>
            <Box className="intro-formSec" textAlign="center">
              <Typography variant="h4">We Are</Typography>
              <Typography variant="h4" fontWeight="bold">
                Dasion Smart Telemedicine
              </Typography>
              <Box className="loginIntro" mt={2}>
                <Typography variant="h6">Welcome back,</Typography>
                <Typography variant="h6">Please login to your account</Typography>
              </Box>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Enter your username"
                      variant="outlined"
                      name="providerUserName"
                      value={form.providerUserName}
                      onChange={handleChange}
                      error={!!errors.providerUserName}
                      helperText={errors.providerUserName}
                      autoComplete="on"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Enter your password"
                      variant="outlined"
                      type="password"
                      name="providerPassword"
                      value={form.providerPassword}
                      onChange={handleChange}
                      error={!!errors.providerPassword}
                      helperText={errors.providerPassword}
                      autoComplete="on"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box textAlign="right">
                      <Link href="/provider/forgot_password" className="forPwd">
                        Forgot password?
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      className="submitBtn"
                      sx={{ mt: 2 }}
                    >
                      Sign In
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box textAlign="center">
                      <Typography variant="body2" mt={2}>
                        Don’t have an account?{" "}
                        <Link href="/provider/register">Sign Up</Link>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
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
                Welcome to the demo of Dasion Smart. This is the place where you can put your practice
                description. Dasion Smart is an application that helps connect providers and patients via
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

export default Login;
