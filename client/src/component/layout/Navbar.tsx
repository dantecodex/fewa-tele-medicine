import React, {useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { AppBar, Toolbar, Typography, Button, Box ,   Avatar,  Menu,
  MenuItem,} from "@mui/material";
import { Link } from "wouter";
import type { User } from "@shared/schema";
// import { navigate } from "wouter/use-browser-location";
import {useNavigate} from "react-router-dom"

export function Navbar() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const { data: user } = useQuery<User>({
  //   queryKey: ["/api/auth/me"],
  //   enabled: false, // Fetch only when needed
  // });

  const providerObj = { nameTitle: "Dr.", name: "John Doe", image: "" };
  const providerUserName = localStorage.getItem("userName");
   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
      localStorage.removeItem("accessToken");
      navigate("/")
    };

  // const [location] = useLocation();

  return (
    <AppBar color="default" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* App Name / Logo */}
        <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: "none", color: "inherit" }}>
        Fewa Telemedicine
        </Typography>
        {/* <Typography variant="h4">Fewa Telemedicine</Typography> */}

        {/* Auth Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {providerObj ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* <Typography variant="body1">Welcome, {user.username}</Typography>
              <Button variant="outlined" onClick={() => {}}>Logout</Button> */}
              <div>
            <Button onClick={handleMenuOpen} startIcon={<Avatar src={providerObj.image || "/assets/img/profilePic.jpg"} />}>
              {providerObj.nameTitle} {JSON.parse(providerUserName)}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </div>
            </Box>
          ) : (
            <>
              <Button component={Link} href="/login" variant="text" 
              // color={location === "/login" ? "primary" : "inherit"}
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
