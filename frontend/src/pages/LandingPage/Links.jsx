import React from "react";
import { Box, Flex, Link } from "@chakra-ui/react";

const NavbarLinks = () => {
  const links = [
    { href: "#home", label: "HOME" },
    { href: "#about-us", label: "ABOUT US" },
    // { href: "#certificates", label: "CERTIFICATES" },
    { href: "#gallery", label: "GALLERY" },
    { href: "#products", label: "PRODUCTS" },
    { href: "#management", label: "MANAGEMENT" },
    { href: "#contact-us", label: "CONTACT US", isButton: true },
  ];

  const handleScroll = (event, href) => {
    event.preventDefault();
    const targetSection = document.querySelector(href);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      position="sticky"
      top="0px"
      zIndex="1000"
      bg="gray.900"
      py={2}
      shadow="md"
      width="100%"
      mx="0"
      left="0"
      right="0"
      transform="translateY(0)"
      transition="transform 0.3s ease"
    >
      <Flex
        justify="center"
        align="center"
        maxW="1200px"
        mx="auto"
        px={4}
        gap={6}
      >
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            onClick={(event) => handleScroll(event, link.href)}
            color="white"
            fontWeight="bold"
            px={3}
            py={2}
            bg={link.isButton ? "#9D152D" : "transparent"}
            borderRadius={link.isButton ? "md" : "none"}
            _hover={{
              color: "white",
              bg: link.isButton ? "red.700" : "#9D152D",
            }}
          >
            {link.label}
          </Link>
        ))}
      </Flex>
    </Box>
  );
};

export default NavbarLinks;
