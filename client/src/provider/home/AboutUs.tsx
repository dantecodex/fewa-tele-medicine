import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import "./Home.scss"; // Import CSS file for styles

const AboutUs = () => {
  return (
    <section className="aboutsection" id="AboutUs">
      <Container>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side: Image */}
          <Grid item xs={12} md={5}>
            <div className="aboutImage">
              <img src="/assets/img/aboutus.png" className="img-fluid" alt="About Us" />
              <div className="aboutBg"></div>
            </div>
          </Grid>

          {/* Right Side: Text Content */}
          <Grid item xs={12} md={7}>
            <div className="about-content">
              <div className="about-header">
                <div className="display-flex">
                  <div className="aboutHeadborder"></div>
                  <Typography variant="h6">About US</Typography>
                </div>
              </div>
              <Typography variant="h3" className="about-title">
                A Wealth of Experience <br /> to heal and help you.
              </Typography>
              <Typography className="about-text">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.
              </Typography>
              <Typography className="about-text">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                specimen book.
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
};

export default AboutUs;
