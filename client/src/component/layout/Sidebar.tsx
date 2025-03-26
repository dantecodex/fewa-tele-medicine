// import React from "react";
// import { Link, useLocation } from "wouter";
// import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
// import { LayoutDashboard, Settings } from "lucide-react";
// import Home from "../../pages/home/Home1.tsx";


// const navigation = [
//   { name: "Home", href: "/", icon: <Home size={20} /> },
//   { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
//   { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
// ];

// export function Sidebar() {
//   const [location] = useLocation();

//   return (
//     <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
//       <List sx={{ width: 240, p: 2 }}>
//         {navigation.map((item) => (
//           <ListItemButton
//             key={item.name}
//             component={Link}
//             href={item.href}
//             selected={location === item.href}
//             sx={{
//               borderRadius: 1,
//               "&.Mui-selected": { bgcolor: "primary.main", color: "white" },
//               "&:hover": { bgcolor: "action.hover" },
//             }}
//           >
//             <ListItemIcon sx={{ color: location === item.href ? "white" : "inherit" }}>
//               {item.icon}
//             </ListItemIcon>
//             <ListItemText primary={item.name} />
//           </ListItemButton>
//         ))}
//       </List>
//     </Drawer>
//   );
// }

import React from "react";
import { NavLink } from "react-router-dom";
import { Box, List, ListItem, ListItemIcon, ListItemText, Drawer } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useLocation } from "wouter";

const Sidebar = ({ adminFlag }) => {
  const [location] = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 210,
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
        {/* Navigation Menu */}
        <List component="nav" className="sidemenu_list">
          {[
            { to: "/provider/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
            { to: "/provider/chat", text: "Chat Section", icon: <ChatIcon /> },
            { to: "/provider/manage_history", text: "Meeting History", icon: <HistoryIcon /> },
            { to: "/provider/user_setting", text: "User Settings", icon: <SettingsIcon /> },
            ...(adminFlag
              ? [{ to: "/provider/account_setting", text: "User Settings", icon: <AdminPanelSettingsIcon /> }]
              : []),
            { to: "/provider/admin_setting", text: "Admin Settings", icon: <AdminPanelSettingsIcon /> },
          ].map(({ to, text, icon }) => {
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
                  <ListItemIcon sx={{ color: isActive ? "white" : "inherit" }}>{icon}</ListItemIcon>
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



