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
  EventCompletePatient: { subscribe: (callback: (patient: Patient) => void) => {} },
  EventGetAllProviders: { subscribe: (callback: (providers: any) => void) => {} },
  EventCallPatient: { subscribe: (callback: (patient: Patient) => void) => {} },
  EventChatMessage: { subscribe: (callback: (chatData: any) => void) => {} },
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

      NotificationService.EventGetAllProviders.subscribe((_providers: any) => {});

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

  const startMeet = () => {
    alert("Meeting started");
    setIsMeetStart(true);
  };

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
            {isMeetStart && (
              <iframe
                src="https://meet.jit.si/FewaTelemedicine"
                allow="camera; microphone; fullscreen; display-capture"
                style={{ width: "100%", height: "600px", border: "none" }}
              ></iframe>

            )}

        </Box>
      )}

      {/* <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Chat</Typography>
        <Box
          sx={{
            height: 300,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 1,
            p: 2,
          }}
          ref={chatContainerRef}
        >
          {currentChat.map((msg, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2">
                <strong>{msg.sender}:</strong> {msg.message}
              </Typography>
            </Box>
          ))}
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          label="Type a message"
          value={chatMessage}
          onChange={handleChatChange}
          onKeyDown={handleChatKeyDown}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" onClick={sendChatMsg} sx={{ mt: 1 }}>
          Send
        </Button>
      </Box> */}
    </Box>
    </MainLayout>
  );
};

export default VideoConference;
