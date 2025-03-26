import React, { useRef, useState } from "react";
import { Button, Box } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

const VideoComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCamOn, setIsCamOn] = useState(false);
  let stream: MediaStream | null = null;

  // Start Video
  const startVideo = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCamOn(true);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Stop Video
  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCamOn(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <video ref={videoRef} autoPlay style={{ width: "100%", maxWidth: "600px", borderRadius: "8px" }} />
      <Box mt={2}>
        {!isCamOn ? (
          <Button variant="contained" color="primary" onClick={startVideo} startIcon={<VideocamOffIcon />}>
            Start Video
          </Button>
        ) : (
          <Button variant="contained" color="secondary" onClick={stopVideo} startIcon={<VideocamIcon />}>
            Stop Video
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default VideoComponent;
