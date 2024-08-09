import React from "react";
import {
  Box,
  Flex,
  Text,
  Link,
  VStack,
  HStack,
  Icon,
  Image,
  Heading,
} from "@chakra-ui/react";
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaPinterest,
  FaInstagram,
} from "react-icons/fa";
import logo from "../../../public/logo.jpeg";

const Footer = () => {
  return (
    <Box bg="gray.900" color="#9d9d9d" py={10}>
      <Flex
        maxW="1200px"
        mx="auto"
        justify="space-between"
        flexWrap="wrap"
        px={4}
        direction={["column", "column", "row"]}
      >
        <VStack
          align="flex-start"
          spacing={4}
          w={["100%", "50%", "25%"]}
          mb={[8, 8, 0]}
        >
          <Image src={logo} alt="Al-Ghani Steel Mills" mb={4} boxSize={"100px"} />
          <Text fontSize="sm" lineHeight="taller">
            WGS is more than just a company; it is a mission that understands its
            <br />
            responsibility in contributing to a better <br />
            and stronger tomorrow. Started as a <br />
            single manufacturing unit in Gujranwala, Pakistan.
          </Text>
          <HStack spacing={4}>
            <Icon as={FaFacebookF} boxSize={6} color={"#9D152D"} />
            <Icon as={FaGoogle} boxSize={6} />
            <Icon as={FaTwitter} boxSize={6} color={"#9D152D"} />
            <Icon as={FaPinterest} boxSize={6} />
            <Icon as={FaInstagram} boxSize={6} color={"#9D152D"} />
          </HStack>
        </VStack>

        <VStack
          align="flex-start"
          spacing={4}
          w={["100%", "48%", "25%"]}
          mb={[8, 8, 0]}
        >
          <Heading as="h4" size="md" mb={4} color="#9D152D" fontWeight={"500"}>
            PRODUCTS
          </Heading>
          <Link href="#" fontSize="sm" _hover={{ color: "white" }} color="#9d9d9d">
            Steel Billet & Ingot
          </Link>
          <Link href="#" fontSize="sm" _hover={{ color: "white" }} color="#9d9d9d">
            Steel Bars
          </Link>
          <Link href="#" fontSize="sm" _hover={{ color: "white" }} color="#9d9d9d">
            T-Iron Bars
          </Link>
          <Link href="#" fontSize="sm" _hover={{ color: "white" }} color="#9d9d9d">
            Angle
          </Link>
          <Link href="#" fontSize="sm" _hover={{ color: "white" }} color="#9d9d9d">
            Patti
          </Link>
        </VStack>

        <VStack
          align="flex-start"
          spacing={4}
          w={["100%", "48%", "25%"]}
          mb={[8, 8, 0]}
        >
          <Heading as="h4" size="md" mb={4} fontWeight={"500"} color={"#9D152D"}>
            CONTACT INFO
          </Heading>
          <Text fontSize="sm" color="#9d9d9d">
            Address: White Gold Steel Industry Glotian Mor, Daska
          </Text>
          <Text fontSize="sm" color="#9d9d9d">
            <strong>White Gold Steel Mills:-</strong>
            <br />
            Call: 052-1565625-3
          </Text>
          <Text fontSize="sm" color="#9d9d9d">
            <strong>WGS Rerolling Mills:-</strong>
            <br />
            Call: 052-12345678-5
          </Text>
          <Text fontSize="sm" color="#9d9d9d">
            <strong>WGS- Enterprises:-</strong>
            <br />
            Call: 051-12345678-7
          </Text>
        </VStack>


        <VStack align="flex-start" spacing={4} w={["100%", "50%", "25%"]}>
          <Heading as="h4" size="md" mb={4} color={"#9D152D"} fontWeight={"500"}>
            OUR LOCATION
          </Heading>
          <Box w="100%" h="200px">
            <iframe
              title="White Gold Steel Mills Location"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=74.19982910156251%2C32.15198435497862%2C74.23202514648439%2C32.17465726337644&amp;layer=mapnik&amp;marker=32.16333150870695%2C74.21592712402344"
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
            <Link
              href="https://www.openstreetmap.org/?mlat=32.1633&amp;mlon=74.2159#map=15/32.1633/74.2159"
              target="_blank"
              rel="noopener noreferrer"
              color="#9d9d9d"
              fontSize="sm"
              mt={2}
              _hover={{ color: "white" }}
            >
              View larger map
            </Link>
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Footer;
