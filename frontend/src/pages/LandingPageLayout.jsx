import React from "react";
import Navbar from "./LandingPage/Navbar";
import NavbarLinks from "./LandingPage/Links";
import { Box } from "@chakra-ui/react";
import Carousel from "./LandingPage/Carousel";
import AboutUs from "./LandingPage/AboutUs";
import Footer from "./LandingPage/Footer";
import FootNote from "./LandingPage/FootNote";
import OurProducts from "./LandingPage/Products";
import ContactUs from "./LandingPage/ContactUs";
import ScrollToTopButton from "./LandingPage/ScrollToTopButton";
NavbarLinks;
const LandingPageLayout = () => {
  return (
    <>
      <Navbar />
      <Box position="relative">
        <NavbarLinks />
        <Carousel />
        <AboutUs />
        <OurProducts/>
        <ContactUs/>
        <Footer />
        <FootNote />
        <ScrollToTopButton/>
      </Box>
    </>
  );
};

export default LandingPageLayout;
