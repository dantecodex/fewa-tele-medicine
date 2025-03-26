import React from "react";
import { Typography } from "@mui/material";

interface ErrorMessageProps {
  patientName: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ patientName }) => {
  return (
    <Typography variant="body2" color="error">
      {patientName} has disconnected
    </Typography>
  );
};

export default ErrorMessage;
