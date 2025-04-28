import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination, CircularProgress,
  Chip, Box, Button, Collapse,
  IconButton
} from '@mui/material';
import MainLayout from '../../component/layout/MainLayout.tsx';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const MeetingHistoryInfo = () => {
  interface Meeting {
    id: string;
    meeting_id: string;
    topic: string;
    patient: {
      first: string;
      last: string;
      email: string;
      phone: string;
    };
    status: string;
  }

  interface PatientInfoRow {
    meetingId: string;
    date: string;
    complaint: string;
    transcript: string;
    soap: string;
    procedure: string;
  }

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  //Soap Notes 
  const [selectedSoap, setSelectedSoap] = useState<string | null>(null);
  const [soapModalOpen, setSoapModalOpen] = useState(false);

  const samplePatientRows: PatientInfoRow[] = [
    {
      meetingId: '84210571541',
      date: '11/03/2021',
      complaint: 'Chest pain',
      transcript: 'Heart attack',
      soap: 'CT – Scan',
      procedure: 'Sent to heart Dr.'
    },
    {
      meetingId: '845012234',
      date: '12/23/2022',
      complaint: 'Surgery follow',
      transcript: 'Infection',
      soap: 'Antibiotic',
      procedure: 'Take string out'
    },
    {
      meetingId: '945012279',
      date: '7/21/2024',
      complaint: 'Broken leg',
      transcript: 'Left leg bone stick out',
      soap: 'X-ray, pain killer',
      procedure: 'Sent to Bone Dr.'
    },
    {
      meetingId: '945012279',
      date: '4/24/2025',
      complaint: 'Left chest pain',
      transcript: 'Blood infection',
      soap: 'CBC, ECG',
      procedure: 'Admitted to ICU'
    },
    {
      meetingId: '84210571541',
      date: '4/15/2025',
      complaint: 'Fever',
      transcript: 'Typhoid',
      soap: 'Blood culture',
      procedure: 'Medication advised'
    }
  ];

  const transcriptData: { [key: string]: string } = {
    'Heart attack': `
Doctor: What seems to be the problem today?
Patient: I've had chest pain since this morning. It’s sharp and hasn’t gone away.
Doctor: Any other symptoms?
Patient: I was sweating a lot and felt sick to my stomach.
Doctor: We’ll do a CT scan immediately to rule out cardiac causes.
(Later)
Doctor: The scan shows signs of a heart attack. We’re sending you to a heart specialist for immediate care.
    `,
    'Infection': `
Doctor: What brings you in today?
Patient: My surgery wound is red and has a discharge.
Doctor: Looks like an infection. I’ll prescribe antibiotics and clean the area.
Patient: Will I need to stay in the hospital?
Doctor: Not yet. But we’ll keep a close watch for the next 48 hours.
    `,
    'Left leg bone stick out': `
Doctor: What happened?
Patient: I fell from stairs. My bone is poking out!
Doctor: You have an open fracture. We’ll do an X-ray and administer painkillers now.
Patient: Will I need surgery?
Doctor: Yes, orthopedic surgery is required immediately.
    `,
    'Blood infection': `
Doctor: You’re showing signs of sepsis.
Patient: I feel dizzy, feverish, and confused.
Doctor: We’re moving you to the ICU for aggressive treatment and monitoring.
    `,
    'Typhoid': `
Doctor: You’ve tested positive for typhoid.
Patient: I’ve had fever for a week and loss of appetite.
Doctor: Antibiotics and rest are necessary. We’ll do daily follow-up.
    `
  };

  const soapData: { [key: string]: string } = {
    'Heart attack': `
  SOAP Note – Visit Date: 11/03/2021
  Chief Complaint: Chest pain
  
  S – Subjective (Patient-reported information):
  • Patient reports sudden-onset chest pain starting this morning.
  • Describes the pain as sharp, central, and constant, radiating slightly to the left arm.
  • Accompanied by sweating, nausea, and shortness of breath.
  • Denies recent trauma, fever, or cough.
  • No prior history of heart disease reported (first incident).
  • No known allergies. No current medications.
  
  O – Objective (Clinician observations & test results):
  Vital signs:
    - BP: 158/89 mmHg
    - HR: 112 bpm
    - RR: 21 breaths/min
    - Temp: 98.6°F
    - O2 Sat: 93% on room air
  
  Physical exam:
    - Patient appears anxious and diaphoretic.
    - No jugular venous distention. No murmurs. Lungs clear to auscultation.
  
  ECG: ST elevations noted in leads II, III, and aVF.
  CT Scan: Confirmed myocardial infarction affecting inferior wall.
  Troponin I: Elevated at 3.5 ng/mL (ref < 0.04)
  
  A – Assessment (Diagnosis and interpretation):
  Acute Inferior Wall Myocardial Infarction (STEMI)
  • High risk presentation with classic symptoms and positive cardiac biomarkers.
  
  P – Plan (Treatment and next steps):
  1. Emergency Intervention:
     • Initiated ACS Protocol: aspirin, nitroglycerin, heparin, statin
     • Oxygen and IV fluids
  2. Cardiology Consultation:
     • Immediate referral for cardiac catheterization
     • Plan for possible PCI (Percutaneous Coronary Intervention)
  3. Monitoring:
     • Continuous cardiac monitoring
     • Repeat troponin in 3–6 hours
  4. Patient Education:
     • Explained condition and urgency
     • Discussed lifestyle changes and follow-up
  `,
    // Add more SOAP notes keyed by some unique identifier (e.g., meeting ID or transcript)
  };



  const renderStatusChip = (status: string) => {
    if (status === 'COMPLETED') {
      return <Chip label="Completed" color="success" size="small" />;
    } else if (status === 'PENDING') {
      return <Chip label="Pending" color="warning" size="small" />;
    } else {
      return <Chip label={status} size="small" />;
    }
  };

  useEffect(() => {
    const fetchDoctorMeetings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:2000/api/v1/doctor/meeting', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setMeetings(data.data);
        } else {
          console.error('Failed to fetch doctor meetings:', data.message);
        }
      } catch (error) {
        console.error('Error fetching doctor meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorMeetings();
  }, []);

  return (
    <MainLayout>
      <Modal
        open={soapModalOpen}
        onClose={() => setSoapModalOpen(false)}
        aria-labelledby="soap-modal-title"
        aria-describedby="soap-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '80vh',
            bgcolor: 'background.paper',
            border: '2px solid #1976d2',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header with Close Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">SOAP Notes</Typography>
            <IconButton onClick={() => setSoapModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Note content */}
          <Typography
            id="soap-modal-description"
            variant="body2"
            sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}
          >
            {selectedSoap}
          </Typography>
        </Box>
      </Modal>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
          <Typography variant="h4">Doctor Meeting History 📋</Typography>

          <Box>
            <Button
              variant="contained"
              sx={{ mr: 2 }}
              onClick={() => setShowPatientInfo(!showPatientInfo)}
            >
              Patient Info
            </Button>
            <Button variant="outlined">Relevant History Summary</Button>
          </Box>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Meeting ID</b></TableCell>
                    <TableCell><b>Topic</b></TableCell>
                    <TableCell><b>Patient Name</b></TableCell>
                    <TableCell><b>Patient Email</b></TableCell>
                    <TableCell><b>Patient Phone</b></TableCell>
                    <TableCell><b>Status</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell>{meeting.meeting_id}</TableCell>
                        <TableCell>{meeting.topic}</TableCell>
                        <TableCell>{meeting.patient.first} {meeting.patient.last}</TableCell>
                        <TableCell>{meeting.patient.email}</TableCell>
                        <TableCell>{meeting.patient.phone}</TableCell>
                        <TableCell>{renderStatusChip(meeting.status)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={meetings.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </>
        )}

        {/* Patient Info Table */}
        {showPatientInfo && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ p: 2 }}>Patient Info</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Meeting ID</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  <TableCell><b>Chief Complaint</b></TableCell>
                  <TableCell><b>Transcript</b></TableCell>
                  <TableCell><b>SOAP Notes</b></TableCell>
                  <TableCell><b>Procedure</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samplePatientRows.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{row.meetingId}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.complaint}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() =>
                            setSelectedTranscript(
                              selectedTranscript === row.transcript ? null : row.transcript
                            )
                          }
                        >
                          {row.transcript}
                        </Button>
                      </TableCell>
                      {/* <TableCell>{row.soap}</TableCell> */}
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            if (soapData[row.transcript]) {
                              setSelectedSoap(soapData[row.transcript]);
                            }
                            // soapData[row.transcript] ? setSelectedSoap(soapData[row.transcript]) : ()=>{}
                            // setSelectedSoap(soapData[row.transcript] || "No SOAP notes available for this record.");
                            setSoapModalOpen(true);
                          }}
                        >
                          {row.soap}
                        </Button>
                      </TableCell>

                      <TableCell>{row.procedure}</TableCell>
                    </TableRow>
                    {/* <TableRow>
                      <TableCell colSpan={6} sx={{ p: 0 }}>
                        <Collapse in={selectedTranscript === row.transcript} timeout="auto" unmountOnExit>
                          <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderLeft: '4px solid #1976d2' }}>
                            <Typography variant="body2" whiteSpace="pre-line">
                              {transcriptData[row.transcript]}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow> */}

                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        )}
        {selectedTranscript && (
          <Box
            sx={{
              mt: 2,
              p: 3,
              bgcolor: '#eef6fb',
              border: '1px solid #1976d2',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Doctor-Patient Conversation: {selectedTranscript}
            </Typography>
            <Typography variant="body2" whiteSpace="pre-line">
              {transcriptData[selectedTranscript]}
            </Typography>
          </Box>
        )}
      </Container>
    </MainLayout>
  );
};

export default MeetingHistoryInfo;


