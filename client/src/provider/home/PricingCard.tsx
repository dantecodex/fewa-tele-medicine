import React from "react";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "wouter";

const plans = [
  {
    title: "Free",
    price: "$0",
    duration: "/Month",
    features: ["1 User", "14 Days Validity"],
    link: "/provider/register",
  },
  {
    title: "PRO",
    price: "$10",
    duration: "/Month",
    features: ["5 Users", "30 Days Validity"],
    link: "/provider/register",
  },
];

const PricingCard = ({ title, price, duration, features, link }) => {
  return (
    <Grid item xs={12} md={4}>
      <Card sx={{ textAlign: "center", padding: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="h4">
            <sup>$</sup>
            {price}
            <span>{duration}</span>
          </Typography>
          <hr />
          <ul style={{ listStyle: "none", padding: 0 }}>
            {features.map((feature, index) => (
              <li key={index} style={{ margin: "8px 0" }}>
                ✅ {feature}
              </li>
            ))}
          </ul>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={link}
            sx={{ marginTop: 2 }}
          >
            Try It
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

const PricingSection = () => {
  return (
    <section id="PlanSection">
      <Container>
        <Typography variant="h4" textAlign="center" fontWeight="bold">
          Find the Perfect Plan for Your Business
        </Typography>
        <Typography variant="body1" textAlign="center">
          Select the perfect plan for your needs. Always flexible to grow.
        </Typography>
        <br />
        <Grid container spacing={3} justifyContent="center">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default PricingSection;
