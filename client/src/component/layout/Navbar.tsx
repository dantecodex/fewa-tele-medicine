import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar, Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "wouter";
import { useNavigate } from "react-router-dom"

export function Navbar() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const providerObj = { nameTitle: "Dr.", name: "John Doe", image: "" };
  const providerUserName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("role");
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (e: any) => {
    e.preventDefault()
    setAnchorEl(null);
  };

  const handleLogout = (e: any) => {
    e.preventDefault()
    // setAnchorEl(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    navigate("/")
  };

  const viewProfile = (e: any) => {
    e.preventDefault()
    // setAnchorEl(null);
    navigate("/provider/doctor_profile")
  };

  const userDisplayName = () => {
    if (userRole === "DOCTOR") {
      return providerObj.nameTitle + " " + (providerUserName ? JSON.parse(providerUserName) : "");
    } else if (userRole === "PATIENT") {
      return providerUserName ? JSON.parse(providerUserName) : "";
    } else {
      return "";
    }
  }

  return (
    <AppBar color="default" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* App Name / Logo */}
        <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: "none", color: "inherit" }}>
          Fewa Telemedicine
        </Typography>

        {/* Auth Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {providerObj ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div>
                <Button onClick={handleMenuOpen} startIcon={<Avatar src={providerObj.image || "/assets/img/profilePic.jpg"} />}>
                  {userDisplayName()}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleMenuClose}>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  <MenuItem onClick={viewProfile}>View Profile</MenuItem>
                </Menu>
              </div>
            </Box>
          ) : (
            <>
              <Button component={Link} href="/login" variant="text"
              >
                Login
              </Button>
              <Button component={Link} href="/register" variant="contained">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
