import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Avatar, Typography, Box } from "@mui/material";

interface ProfileMenuProps {
  nameTitle?: string;
  providerName?: string;
  profileImage?: string;
  onLogout?: () => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  nameTitle = "Dr.",
  providerName = "John Doe",
  profileImage = "",
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleClick}>
        <Avatar src={profileImage || "/assets/img/profilePic.jpg"} alt="Profile" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
      <Typography variant="subtitle1" sx={{ marginLeft: 1 }}>
        {nameTitle} {providerName}
      </Typography>
    </Box>
  );
};

export default ProfileMenu;
