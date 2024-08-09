import React from "react";
import { Box, Flex, Image, Text, Link, Button, HStack } from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { MdLocationOn } from "react-icons/md";
import logo from "../../../public/logo.jpeg";

const Navbar = () => {
  return (
    <Box
      position="relative"
      top="0"
      zIndex="1000"
      bg="white"
      shadow="md"
      as="nav"
      pb={2}
    >
      <Flex
        justify="space-between"
        align="center"
        maxW="1200px"
        mx="auto"
        px={4}
      >

        <Flex justify="center">
          <Image src={logo} alt="Gold Steel Mills" boxSize="100px" />
        </Flex>

        <Flex flexWrap={"wrap"} gap={2}>
          <Box ml={1}>
            <Flex m={"auto"} align={"center"} mt={1} gap={2}>
              <Flex align="center" gap={2}>
                <Box p={2} bg="gray.100" borderRadius="full">
                  <MdLocationOn color="red" />
                </Box>
                <Text fontSize="sm" fontWeight="500">
                  White Gold Steel Industry Glotian Mor, Daska
                </Text>
              </Flex>
            </Flex>
            <Flex align={"center"} mt={1} gap={2}>
              <Flex align="center" gap={2}>
                <Box p={2} bg="gray.100" borderRadius="full">
                  <EmailIcon color="red" />
                </Box>
                <Link fontSize="sm" fontWeight="500">
                  whitegoldsteels@xyz.com
                </Link>
              </Flex>
              <Flex align="center" gap={2}>
                <Box p={2} bg="gray.100" borderRadius="full">
                  <PhoneIcon color="red" />
                </Box>
                <Text fontSize="sm" fontWeight="500">
                  +92012345678
                </Text>
              </Flex>
            </Flex>
            <Flex align={"center"} mt={1} gap={2}></Flex>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;