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
          <Image
            src={logo}
            alt="Al-Ghani Steel Mills"
            mb={4}
            boxSize={"100px"}
          />
          <Text fontSize="sm" lineHeight="taller">
            WGS is more than just a company; it is a mission that understands
            its
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
          <Link
            href="#"
            fontSize="sm"
            _hover={{ color: "white" }}
            color="#9d9d9d"
          >
            Steel Billet & Ingot
          </Link>
          <Link
            href="#"
            fontSize="sm"
            _hover={{ color: "white" }}
            color="#9d9d9d"
          >
            Steel Bars
          </Link>
          <Link
            href="#"
            fontSize="sm"
            _hover={{ color: "white" }}
            color="#9d9d9d"
          >
            T-Iron Bars
          </Link>
          <Link
            href="#"
            fontSize="sm"
            _hover={{ color: "white" }}
            color="#9d9d9d"
          >
            Angle
          </Link>
          <Link
            href="#"
            fontSize="sm"
            _hover={{ color: "white" }}
            color="#9d9d9d"
          >
            Patti
          </Link>
        </VStack>

        <VStack
          align="flex-start"
          spacing={4}
          w={["100%", "48%", "25%"]}
          mb={[8, 8, 0]}
        >
          <Heading
            as="h4"
            size="md"
            mb={4}
            fontWeight={"500"}
            color={"#9D152D"}
          >
            CONTACT INFO
          </Heading>
          <Text fontSize="sm" color="#9d9d9d">
            Address: 78W6+4HW, Daska Rd, سیالکوٹ, Sialkot, Punjab 52250
          </Text>
          <Text fontSize="sm" color="#9d9d9d">
            <strong>White Gold Steel Mills:-</strong>
            <br />
            Call: 052-1565625-3
          </Text>
          <Text fontSize="sm" color="#9d9d9d">
            <strong>WGS Rerolling Mills:-</strong>
            <br />
            Call: +92-306-6438796
          </Text>
          <Text fontSize="sm" color="#9d9d9d">
            <strong>WGS- Enterprises:-</strong>
            <br />
            Call: +92-305-6148001
          </Text>
        </VStack>

        <VStack align="flex-start" spacing={4} w={["100%", "50%", "25%"]}>
          <Heading
            as="h4"
            size="md"
            mb={4}
            color={"#9D152D"}
            fontWeight={"500"}
          >
            OUR LOCATION
          </Heading>
          <Box w="100%" h="200px">
            <iframe
              title="White Gold Steel Mills Location"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.683882646124!2d74.3115067!3d32.2942144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391ed99694205a51%3A0x63a8d62e1ce2e6c9!2sWhite%20Gold%20Steel%20Mills!5e0!3m2!1sen!2s!4v1692996202132!5m2!1sen!2s"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <Link
              href="https://www.google.com/maps/place/White+Gold+Steel+Mills/@32.2942144,74.3115067,16z/data=!4m6!3m5!1s0x391ed99694205a51:0x63a8d62e1ce2e6c9!8m2!3d32.29536!4d74.3114418!16s%2Fg%2F11j4qk2454?entry=ttu&g_ep=EgoyMDI0MDgyMS4wIKXMDSoASAFQAw%3D%3D"
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
