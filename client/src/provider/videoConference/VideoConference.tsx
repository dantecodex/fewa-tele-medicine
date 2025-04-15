"use client";

import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { TextField, Button, Box, Paper, Typography } from "@mui/material";
import Jitsi from "react-jitsi"; // Import Jitsi Meet
import { navigate } from "wouter/use-browser-location";
import MainLayout from "../../component/layout/MainLayout.tsx";

interface Patient {
  name?: string;
  url?: string;
  endTime?: Date;
}

interface Provider {
  userName: string;
  roomName: string;
  url: string;
}

// Static Global Context (Temporary Dummy Data)
const global = {
  isPatient: true,
  providerObj: {
    userName: "Dr. Smith",
    roomName: "FewaTelemedicine",
    url: "https://example.com/provider-room",
  },
  patientObj: {
    name: "John Doe",
    url: "https://example.com/patient-room",
  },
};

const NotificationService = {
  EventCompletePatient: { subscribe: (callback: (patient: Patient) => void) => { } },
  EventGetAllProviders: { subscribe: (callback: (providers: any) => void) => { } },
  EventCallPatient: { subscribe: (callback: (patient: Patient) => void) => { } },
  EventChatMessage: { subscribe: (callback: (chatData: any) => void) => { } },
  LoadActiveDoctors: () => console.log("Loading active doctors..."),
  Connect: () => console.log("Connecting..."),
  CallEnds: (patient: Patient) => console.log("Call ended for", patient),
  SendChatMessage: (message: any) => console.log("Chat message sent:", message),
};

const VideoConference: React.FC = () => {
  const [isMeetStart, setIsMeetStart] = useState<boolean>(false);
  const [currentChat, setCurrentChat] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState<string>("");
  const [patientObj, setPatientObj] = useState<Patient>(global.patientObj);
  const [providerObj, setProviderObj] = useState<Provider>(global.providerObj);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [zoomMeetingUrl, setZoomMeetingUrl] = useState<string | null>(null);


  const roomName: string = providerObj.roomName;
  const remoteUserDisplayName: string = patientObj.name;

  useEffect(() => {
    initVideoConference();
  }, []);

  const initVideoConference = () => {
    if (global.isPatient) {
      NotificationService.EventCompletePatient.subscribe((_patient: Patient) => {
        setPatientObj(_patient);
        patientCompleted(_patient);
      });

      NotificationService.EventGetAllProviders.subscribe((_providers: any) => { });

      NotificationService.LoadActiveDoctors();
    } else {
      NotificationService.Connect();

      NotificationService.EventCallPatient.subscribe((_patient: Patient) => {
        setPatientObj(_patient);
      });

      NotificationService.EventChatMessage.subscribe((chatData: any) => {
        setCurrentChat((prevChat) => [...prevChat, chatData]);
        scrollToBottom();
      });
    }
  };

  // const startMeet = () => {
  //   alert("Meeting started");
  //   setIsMeetStart(true);
  // };


  const startMeet = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch("http://localhost:2000/api/v1/zoom/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // topic: "Fewa Telemedicine Call",
          // userRole: global.isPatient ? "patient" : "provider",
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setZoomMeetingUrl(result.data);
        setIsMeetStart(true);
      } else {
        alert("Failed to create Zoom meeting.");
        console.error("Zoom API Error:", result.message);
      }
    } catch (error) {
      console.error("Zoom API Fetch Error:", error);
      alert("An error occurred while starting the meeting.");
    }
  };
  
  // const patientCompleted = (patient: Patient) => {
  //   if (!patient) return;

  //   setIsMeetStart(false);
  //   patient.url = providerObj.url;
  //   patient.endTime = new Date();
  //   global.patientObj = patient;
  //   NotificationService.CallEnds(patient);
  // };
  // const handleJoinZoomMeeting = () => {
  //   if (zoomMeetingUrl) {
  //     window.open(zoomMeetingUrl, "_blank");
  //   } else {
  //     alert("No Zoom meeting URL available.");
  //   }
  // };
  // const handleLeaveZoomMeeting = () => {
  //   if (zoomMeetingUrl) {
  //     window.close();
  //   } else {
  //     alert("No Zoom meeting URL available.");
  //   }
  // };  

  const endMeet = () => {
    if (!patientObj) return;

    setIsMeetStart(false);
    patientObj.url = providerObj.url;
    patientObj.endTime = new Date();
    global.patientObj = patientObj;
    NotificationService.CallEnds(patientObj);
    navigate("/provider/report");
  };

  const sendChatMsg = () => {
    if (!chatMessage.trim()) return;

    const sendingChatMsg = {
      isProvider: true,
      sender: providerObj.userName,
      receiver: patientObj.name,
      message: chatMessage,
    };

    setCurrentChat((prevChat) => [...prevChat, sendingChatMsg]);
    NotificationService.SendChatMessage(sendingChatMsg);
    scrollToBottom();
    setChatMessage("");
  };

  const handleChatChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChatMessage(event.target.value);
  };

  const handleChatKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendChatMsg();
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  const agoraAppId = 'cd1f3f29ef86458a8fce0a2a3c5b192b';

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Video Conference</Typography>

        <Paper elevation={3} sx={{ p: 2, my: 2 }}>
          <Typography variant="h6">Room: {roomName}</Typography>
          <Typography variant="subtitle1">User: {remoteUserDisplayName}</Typography>

          {!isMeetStart ? (
            <Button variant="contained" color="primary" onClick={startMeet} sx={{ mt: 2 }}>
              Start Video Call
            </Button>
          ) : (
            <Button variant="contained" color="error" onClick={endMeet} sx={{ mt: 2 }}>
              End Meeting
            </Button>
          )}
        </Paper>

        {isMeetStart && (
          <Box sx={{ width: "100%", height: "600px", mt: 2 }}>
            {/* <Jitsi
            roomName={roomName}
            displayName={remoteUserDisplayName}
            config={{
              prejoinPageEnabled: false,
              disableDeepLinking: true,
            }}
            onAPILoad={(JitsiMeetAPI) => console.log("Jitsi Meet API loaded")}
          /> */}
            {isMeetStart && zoomMeetingUrl && (
              <Box sx={{ width: "100%", height: "600px", mt: 2 }}>
                <iframe
                  src={zoomMeetingUrl}
                  allow="camera; microphone; fullscreen"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="Zoom Meeting"
                />
              </Box>
            )}


          </Box>
        )}
      </Box>
    </MainLayout>
  );
};

export default VideoConference;
