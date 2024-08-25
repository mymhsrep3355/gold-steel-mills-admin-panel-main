import React, { useEffect, useState } from "react";
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

import Gallery from "./LandingPage/Gallery";
import Loader from "./LandingPage/Loader/Loader";

const LandingPageLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <Box m={"auto"} mt={"600px"}>
        <Loader />
      </Box>
    );
  }
  return (
    <>
      <Navbar />
      <Box position="relative">
        <NavbarLinks />
        <Box id="home">
          <Carousel />
        </Box>
        <Box id="about-us">
          <AboutUs />
        </Box>
        <Box id="gallery">
          <Gallery />
        </Box>
        <Box id="products">
          <OurProducts />
        </Box>
        <Box id="contact-us">
          <ContactUs />
        </Box>
        <Box id="management">
          <Footer />
        </Box>
        <FootNote />
        <ScrollToTopButton />
      </Box>
    </>
  );
};

export default LandingPageLayout;
