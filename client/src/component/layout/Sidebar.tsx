import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation } from "wouter";

const Sidebar = ({ role = "doctor", adminFlag = false }) => {
  const [location] = useLocation();
  const doctorMenu = [
    { to: "/provider/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
    { to: "/provider/chat", text: "Chat Section", icon: <ChatIcon /> },
    { to: "/provider/manage_history", text: "Meeting History", icon: <HistoryIcon /> },
    { to: "/provider/user_setting", text: "User Settings", icon: <SettingsIcon /> },
    // { to: "/provider/account_setting", text: "Account Settings", icon: <AdminPanelSettingsIcon /> }
    // ...(adminFlag
    //   ? [{ to: "/provider/account_setting", text: "Account Settings", icon: <AdminPanelSettingsIcon /> }]
    //   : [])
    // { to: "/provider/admin_setting", text: "Admin Settings", icon: <AdminPanelSettingsIcon /> },
  ];

  const patientMenu = [
    { to: "/patient/home", text: "Dashboard", icon: <DashboardIcon /> },
    // { to: "/patient/live_video", text: "Live Video", icon: <ChatIcon /> },
    // { to: "/patient/appointment_history", text: "Appointments", icon: <HistoryIcon /> },
    // { to: "/patient/settings", text: "Settings", icon: <SettingsIcon /> },
  ];
  console.log("role", localStorage.getItem("role"));
  const menuItems = localStorage.getItem("role") === "DOCTOR" ? doctorMenu : patientMenu;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 100,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          mt: 9,
        },
      }}
    >
      <Box
        className="left_sidemenu"
        sx={{ width: 250, bgcolor: "background.paper", height: "100vh", padding: 2 }}
      >
        <List component="nav" className="sidemenu_list">
          {menuItems.map(({ to, text, icon }) => {
            const isActive = location === to;
            return (
              <NavLink key={to} to={to} style={{ textDecoration: "none" }}>
                <ListItem
                  button
                  sx={{
                    bgcolor: isActive ? "blue" : "transparent",
                    color: isActive ? "white" : "black",
                    borderRadius: 2,
                    "&:hover": { bgcolor: isActive ? "blue" : "#f0f0f0" },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? "white" : "inherit" }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </NavLink>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
