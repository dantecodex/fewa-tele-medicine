import React, { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, Container, Box, Link } from "@mui/material";
// import Image from "next/image";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data: any) => {
    console.log("Form Submitted:", data);
    // Simulate an error for demo purposes
    if (data.username !== "admin" || data.password !== "admin") {
      setErrorMsg("Invalid username or password");
    }
  };

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: "center", mt: 5 }}>
        {/* <Image src="/assets/img/stethoscope.png" alt="Logo" width={80} height={80} /> */}
        <Typography variant="h4" sx={{ mt: 2 }}>We Are</Typography>
        <Typography variant="h3" color="primary">Fewa Telemedicine</Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Welcome back,</Typography>
          <Typography variant="h6">Please login to your account</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Enter your username"
              {...register("username", { required: "Username is required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
              autoComplete="on"
              margin="normal"
            />

            <TextField
              fullWidth
              label="Enter your password"
              type="password"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
              autoComplete="on"
              margin="normal"
            />
          </Box>

          <Box sx={{ textAlign: "right", mt: 1 }}>
            <Link href="/forgot_password" underline="hover">Forgot password?</Link>
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Sign In</Button>

          {errorMsg && <Typography color="error" sx={{ mt: 2 }}>{errorMsg}</Typography>}

          <Typography sx={{ mt: 2 }}>
            Don’t have an account? <Link href="/register">Sign Up</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
