// import React from "react";
// import { AppBar, Toolbar, Typography, Box } from "@mui/material";
// import ProfileMenu from "./ProfileMenu.tsx";
// import ErrorMessage from "./ErrorMessage.tsx";

// interface DashboardHeaderProps {
//   disconnectPatient: boolean;
//   patientName: string;
// }

// const DashboardHeader: React.FC<DashboardHeaderProps> = ({ disconnectPatient, patientName }) => {
//   return (
//     <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000", padding: "10px", marginTop:"50px" }}>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         {/* Left Section - Title & Error Message */}
//         <Box>
//           <Typography variant="h3" fontWeight="bold">
//             Dashboard
//           </Typography>
//           {disconnectPatient && <ErrorMessage patientName={patientName} />}
//         </Box>

//         {/* Right Section - Profile Dropdown */}
//         <ProfileMenu />
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default DashboardHeader;
