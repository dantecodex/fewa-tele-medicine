import React, { useEffect, useState, createContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";

const GlobalContext = createContext({
  practiceObj: { name: "Dr.John Clinic" },
  providerObj: { providerId: "123", nameTitle: "Dr.", name: "John Doe", userName: "johndoe" },
  patientObj: {
    advice: [
      { providerId: "123", advice: "Blood Pressure Check", isChecked: true },
      { providerId: "123", advice: "Blood Test", isChecked: false }
    ],
    medication: "Take Paracetamol 500mg twice a day for 3 days.",
    followUpNumber: 2,
    followUpMeasure: "weeks",
    email: "patient@example.com"
  },
  practiceUrl: "https://api.example.com/",
});

export interface ProviderAdvice {
  providerId: string;
  advice: string;
  isChecked: boolean;
}

export interface Patient {
  advice?: ProviderAdvice[];
  medication?: string;
  followUpNumber?: number;
  followUpMeasure?: string;
  email?: string;
}

const Summary: React.FC = () => {
  const { practiceObj, providerObj, patientObj, practiceUrl } =
    React.useContext(GlobalContext);

  const [patient, setPatient] = useState<Patient | null>(patientObj);
  const [email, setEmail] = useState<string>(patientObj.email || "");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [sendEmailMsg, setSendEmailMsg] = useState<boolean>(false);
  const [emailFailMsg, setEmailFailMsg] = useState<boolean>(false);

  // Handle Checkbox Change
  const handleCheckboxChange = (index: number) => {
    if (!patient) return;
    const updatedAdvice = [...(patient.advice || [])];
    updatedAdvice[index].isChecked = !updatedAdvice[index].isChecked;
    setPatient({ ...patient, advice: updatedAdvice });
  };

  // Handle TextField Change
  const handleTextFieldChange = (field: keyof Patient, value: string | number) => {
    if (!patient) return;
    setPatient({ ...patient, [field]: value });
  };

  // Handle Select Change
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!patient) return;
    setPatient({ ...patient, followUpMeasure: event.target.value as string });
  };

  const sendReport = async () => {
    if (!email.trim()) return;
    setDisableButton(true);
    try {
      const key = "73l3M3D";
      const updatedPatient = { ...patient, email: email.trim() };
      const response = await axios.post(
        `/Messenger/EmailPatientReport?key=${key}`,
        updatedPatient
      );
      if (response.data) {
        setSendEmailMsg(true);
        setTimeout(() => setSendEmailMsg(false), 10000);
      } else {
        setEmailFailMsg(true);
        setTimeout(() => setEmailFailMsg(false), 10000);
      }
    } catch (error) {
      console.error("Error sending report:", error);
      setEmailFailMsg(true);
      setTimeout(() => setEmailFailMsg(false), 10000);
    }
    setDisableButton(false);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <Container>
      <Box textAlign="center" my={4}>
        <Typography variant="h4">{practiceObj.name}</Typography>
      </Box>
      <Card>
        <CardContent>
          {providerObj && (
            <Typography variant="h5">
              Thank You For Consulting{" "}
              {providerObj.nameTitle && `${providerObj.nameTitle} `}
              {providerObj.name || providerObj.userName}
            </Typography>
          )}

          {patient ? (
            <Box mt={3}>
              <Typography variant="h6">Visit Summary</Typography>

              {(patient.advice ?? []).length > 0 && (
                <Box mt={2}>
                  <Typography>What we did today?</Typography>
                  {(patient.advice ?? []).map((adv, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={adv.isChecked}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      }
                      label={adv.advice}
                    />
                  ))}
                </Box>
              )}

              <Box mt={2}>
                <Typography>Advice</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={patient.medication || ""}
                  onChange={(e) => handleTextFieldChange("medication", e.target.value)}
                />
              </Box>

              <Box mt={2} display="flex" alignItems="center">
                <TextField
                  label="Follow Up Number"
                  type="number"
                  value={patient.followUpNumber || ""}
                  onChange={(e) => handleTextFieldChange("followUpNumber", Number(e.target.value))}
                  sx={{ mr: 2, width: "150px" }}
                />
                <Select
                  value={patient.followUpMeasure || "weeks"}
                  onChange={handleSelectChange}
                  displayEmpty
                >
                  <MenuItem value="weeks">Weekly</MenuItem>
                  <MenuItem value="months">Monthly</MenuItem>
                  <MenuItem value="years">Yearly</MenuItem>
                </Select>
              </Box>

              <Box mt={4} display="flex" alignItems="center">
                <TextField
                  label="Enter email address"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!email.trim()}
                  helperText={!email.trim() ? "Email is required." : ""}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={disableButton}
                  onClick={sendReport}
                  sx={{ ml: 2 }}
                >
                  {disableButton ? <CircularProgress size={24} /> : "Send"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={printReport}
                  sx={{ ml: 2 }}
                >
                  Print
                </Button>
              </Box>

              {sendEmailMsg && <Alert severity="success">Report has been sent to your email.</Alert>}
              {emailFailMsg && <Alert severity="error">Unable to send, try again!</Alert>}
            </Box>
          ) : (
            <Typography textAlign="center" mt={3}>
              Please wait, the provider will provide the report.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Summary;
