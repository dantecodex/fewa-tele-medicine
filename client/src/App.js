import React from "react";
// import { Switch, Route } from "wouter";
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Dashboard from "../src/provider/dashboard/Dashboard.tsx";
import Login from "../src/provider/login/Login.tsx";
import Register from "../src/provider/register/Register.tsx";
import ForgotPassword from "../src/provider/forgotPassword/ForgotPassword.tsx";
// import Home from "../src/provider/home/Home.tsx";
import Home from "../src/provider/home/Home1.tsx";
import Chat from "../src/provider/chat/Chat.tsx";
import VideoConference from "../src/provider/videoConference/VideoConference.tsx";
// import Report from "../src/provider/report/Report.tsx";
import Report from "./provider/reports/Report.tsx";
import { BrowserRouter, Navigate } from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MeetingHistory from "./provider/meetingHistory/MeetingHistory.tsx";
import UserSettings from "./provider/userSettings/UserSettings.tsx";
import AdminSettings from "./provider/adminSetting/AdminSetting.tsx";
import LiveChat from "./provider/liveVideo/LiveVideo.tsx";
import PatientIntro from "./patient/patientInto/PatientIntro.tsx";
import LiveVideoChat from "./patient/liveVideoChat/LiveVideoChat.tsx";
import Summary from "./patient/summary/Summary.tsx";
// import LiveVideoChat from "./patient/liveVideoChat/LiveVideoChat.tsx";

// Create a client
const queryClient = new QueryClient();

const IsAuthenticated = ({ children }) => {
  console.log("children", children);
  const isAuthenticated = localStorage.getItem("accessToken"); // Check if token exists
  return isAuthenticated ? children : <Navigate to="/provider/login" />;
};

function Router() {
  return (
    <Switch>
      <Route path="/">
        {/* <Home /> */}
        <Home />
      </Route>
      <Route path="/provider/login">
        <Login />
      </Route>
      <Route path="/provider/register">
        <Register />
      </Route>
      <Route path="/provider/forgot_password">
        <ForgotPassword />
      </Route>
      <Route path="/provider/dashboard">
        <IsAuthenticated> <Dashboard /> </IsAuthenticated>
      </Route>
      <Route path="/provider/chat">
        <IsAuthenticated>  <Chat /> </IsAuthenticated>
      </Route>
      <Route path="/provider/video_conference">
        <IsAuthenticated>   <VideoConference /> </IsAuthenticated>
      </Route>
      <Route path="/provider/report">
        <IsAuthenticated>  <Report /> </IsAuthenticated>
      </Route>
      <Route path="/provider/manage_history">
        <IsAuthenticated>  <MeetingHistory /> </IsAuthenticated>
      </Route>
      <Route path="/provider/user_setting">
        <IsAuthenticated>  <UserSettings /> </IsAuthenticated>
      </Route>
      <Route path="/provider/admin_setting">
        <IsAuthenticated>  <AdminSettings /> </IsAuthenticated>
      </Route>
      <Route path="/provider/live_video">
        <IsAuthenticated>   <LiveChat /> </IsAuthenticated>

      </Route>
      <Route path="/patient/intro">
        <PatientIntro />
      </Route>
      <Route path="/patient/live_video">
        <LiveVideoChat />
      </Route>
      <Route path="/patient/summary">
        <Summary />
      </Route>
      {/* <Route component={NotFound} /> */}
    </Switch>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Router />
      {/* <Toaster /> */}
    </BrowserRouter>
  );
}

export default App;