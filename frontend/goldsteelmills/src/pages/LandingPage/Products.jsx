import React from "react";
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Heading,
  Divider,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";

const products = [
  { name: "Angle", image: "../../../public/c4.jpg" },
  { name: "T-Iron Bars", image: "../../../public/c5.jpg" },
  { name: "Patti", image: "../../../public/c6.jpg" },
  { name: "Steel Bars", image: "../../../public/c7.jpg" },
  { name: "Steel Billet", image: "../../../public/c8.jpg" },
  { name: "Steel Rods", image: "../../../public/c9.jpg" },
];

const OurProducts = () => {
  const boxBgColor = useColorModeValue("white", "gray.700");
  const boxHoverColor = useColorModeValue(
    "rgba(214, 214, 214, 0.8)",
    "rgba(0, 0, 0, 0.6)"
  );
  const buttonColor = useColorModeValue("red.500", "red.300");
  const underlineColor = useColorModeValue('#9D152D', '#9D152D');

  return (
    <Box p={8} bg={useColorModeValue("gray.50", "gray.800")}>
      <Heading as="h2" size="xl" mb={4} textAlign="center">
        Our Products
      </Heading>
      <Box w="50px" h="2px" bg={underlineColor} mx="auto" mt={1} mb={6} />
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={10}>
        {products.map((product, index) => (
          <Box
            key={index}
            position="relative"
            overflow="hidden"
            p={4}
            bg={boxBgColor}
            boxShadow="md"
            rounded="md"
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              h="200px"
            >
              <Image
                src={product.image}
                alt={product.name}
                borderRadius="md"
                maxH="100%"
                maxW="100%"
                objectFit="contain"
              />
            </Box>
            <Text fontSize="lg" fontWeight="bold" textAlign="center" mt={4}>
              {product.name}
            </Text>
            <Box
              position="absolute"
              top="0"
              left="0"
              w="100%"
              h="100%"
              bg={boxHoverColor}
              transition="all 0.3s ease"
              opacity={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ opacity: 1 }}
            >
              <Button bg="red.600" size="sm">
                <Text color={"white"}>Open Details</Text>
              </Button>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default OurProducts;
