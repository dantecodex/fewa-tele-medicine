import React, { useState } from "react";
import { Container, Grid, Typography, Button, TextField, Paper, Box } from "@mui/material";
import { Link } from "wouter";
import  './Home.scss';
import AboutUs from "./AboutUs.tsx";
import PricingCard from "./PricingCard.tsx";

const Home = () => {
  const [showViewMoreInfo, setShowViewMoreInfo] = useState(false);

  return (
    <>
      {/* Header Section */}
      <header className="homeBanner">
        <Container>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography
                variant="h6"
                component={Link}
                href="/"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Box component="img" src="/assets/img/dasionlogo.png" alt="dasion" sx={{ width: 40, height: 40, mr: 1 }} />
                Dasion Smart Telemedicine
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <nav>
                <ul style={{ display: "flex", gap: "15px", listStyle: "none" }}>
                  <li><Link to="/provider/home#HowItWork">How it works</Link></li>
                  <li><Link to="/provider/home#ContactSection">Contact Us</Link></li>
                  <li>|</li>
                  <li><Link to="/provider/register" className="signupBtn">Sign Up</Link></li>
                  <li><Link to="/provider/login" className="signupBtn">Sign In</Link></li>
                </ul>
              </nav>
            </Grid>
          </Grid>
        </Container>
      </header>

      {/* Banner Content */}
      <section className="bannerContent">
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3">Skip the travel!</Typography>
              <Typography variant="h4">Take Online Provider Consultation</Typography>
              <Typography>
                Telemedicine solution for the world! Simple to sign up and customizable with affordable pricing.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => setShowViewMoreInfo(!showViewMoreInfo)}>
                View More
              </Button>
              {showViewMoreInfo && (
                <Typography>
                  Built and designed by experts in the medical field with an optimal patient-provider interaction flow.
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <img src="/assets/img/provider-banner.png" alt="Banner" width="100%" />
              {/* <img src={providerBanner} alt="Banner" width="100%" /> */}
            </Grid>
          </Grid>
        </Container>
      </section>

      <AboutUs/>

      {/* How It Works Section */}
      <section id="HowItWork">
        <Container>
          <Typography variant="h3" align="center">How it works</Typography>
          <Typography align="center">Location independent - All that is needed is a network connection.</Typography>

          <Grid container spacing={4} sx={{ marginTop: 3 }}>
            {[
              { id: 1, img: "what-we-do-1.png", title: "Select your Patient", text: "Provider logs in and sends a sign-in link to the patient." },
              { id: 2, img: "what-we-do-2.png", title: "Talk to Provider", text: "Patient clicks on the link from any browser and joins the virtual lobby." },
              { id: 3, img: "what-we-do-3.png", title: "Communicate with Patient", text: "Provider brings the patient in and consultation begins." },
              { id: 4, img: "what-we-do-4.png", title: "Chat with Provider", text: "After-visit summary is generated and shared with the patient." },
            ].map((item) => (
              <Grid item xs={12} md={6} key={item.id}>
                <Paper elevation={3} sx={{ padding: 3, display: "flex", alignItems: "center" }}>
                  <Typography variant="h3" sx={{ marginRight: 2 }}>{item.id}</Typography>
                  <div>
                    <img src={`/assets/img/${item.img}`} alt={item.title} width="60px" />
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography>{item.text}</Typography>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography align="center" sx={{ marginTop: 4 }}>
            We take HIPAA seriously and prioritize patient privacy. We NEVER save a patient’s email or phone number.
          </Typography>
        </Container>
      </section>

      <PricingCard/>

      {/* Contact Section */}
      <section id="ContactSection">
        <Container>
          <Typography variant="h3" align="center">Contact Us</Typography>
          <Typography align="center">Any questions? Just send us a message!</Typography>

          <Grid container spacing={3} sx={{ marginTop: 3 }}>
            <Grid item xs={12} md={6}>
              <img src="/assets/img/contact-image.png" alt="Contact" width="100%" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 3 }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField label="First Name" fullWidth required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Last Name" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Email" type="email" fullWidth required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Phone" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Message" multiline rows={3} fullWidth required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Button variant="contained" color="primary" type="submit">
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Footer Section */}
      <footer className="footersection">
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">About Dasion</Typography>
              <Typography>
                Dasion Smart Telemedicine is a product of Imark USA LLC, designed by medical professionals for optimized patient-provider interaction.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h5">Main Links</Typography>
              <ul>
                <li>How it Works</li>
                <li>Contact Us</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h5">Community</Typography>
              <ul>
                <li>Blog</li>
                <li>Help Centers</li>
                <li>Team</li>
                <li>Provider Support</li>
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5">Contact Us</Typography>
              <Typography>Email: Dasion Smarttele@gmail.com</Typography>
              <Typography>Address: 302 Paoli Woods Paoli, PA 19301 USA.</Typography>
            </Grid>
          </Grid>
        </Container>
      </footer>
    </>
  );
};

export default Home;
