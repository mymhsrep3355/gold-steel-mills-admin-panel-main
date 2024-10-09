import React, { useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  VStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const galleryItems = [
  {
    id: 1,
    src: "https://plus.unsplash.com/premium_photo-1661962860051-0e7d76a9ad8f?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "MULTI SPRING PUSH",
    subtitle: "Mechanical",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1613970351372-9804e380bd09?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "STEEL FURNACE",
    subtitle: "Manufacturing",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1598958534937-e337db3564ae?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "INDUSTRIAL PLANT",
    subtitle: "Operations",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "PRECISION MACHINING",
    subtitle: "Engineering",
  },

];

const Gallery = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (scrollOffset) => {
    scrollContainerRef.current.scrollLeft += scrollOffset;
  };
  const underlineColor = useColorModeValue("#9D152D", "#9D152D");

  return (
    
    <Box
      position="relative"
      py={10}
      px={4}
      overflow="hidden"
    >
    
      <Box
        bgImage="url('https://images.unsplash.com/photo-1624027492684-327af1fb7559?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        bgSize="cover"
        bgPosition="center"
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        opacity={0.7}
        zIndex={0}
      />

      
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.7)"
        zIndex={1}
      />

      <Heading as="h2" size="lg" color="white" mb={8} pl={4} zIndex={2} position="relative">
        Gallery
        <Box w="110px" h="2px" bg={underlineColor} ml={1} mt={3} mb={3} />
      </Heading>
      

      <Flex
        ref={scrollContainerRef}
        maxW="1200px"
        mx="auto"
        justify="flex-start"
        flexWrap="nowrap"
        gap={4}
        overflowX="auto"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        zIndex={2}
        position="relative"
      >
        {galleryItems.map((item) => (
          <VStack
            key={item.id}
            as={motion.div}
            position="relative"
            width="280px"
            height="180px"
            overflow="hidden"
            borderRadius="md"
            whileHover={{ scale: 1.05 }}
            cursor="pointer"
            bgImage={`url(${item.src})`}
            bgSize="cover"
            bgPosition="center"
            boxShadow="md"
            flexShrink={0}
          >
            <Box
              as={motion.div}
              position="absolute"
              bottom="0"
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.6)"
              opacity={0}
              transition="opacity 0.3s ease-in-out"
              _hover={{ opacity: 1 }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Text color="white" fontWeight="bold" fontSize="lg">
                {item.title}
              </Text>
              <Text color="red.500" fontSize="sm">
                {item.subtitle}
              </Text>
            </Box>
          </VStack>
        ))}
      </Flex>

      <IconButton
        aria-label="Scroll Left"
        icon={<FaChevronLeft />}
        position="absolute"
        left="20px"
        top="50%"
        transform="translateY(-50%)"
        bg="black"
        color="white"
        _hover={{ bg: "#9D152D" }}
        zIndex="10"
        onClick={() => scroll(-300)}
      />

      <IconButton
        aria-label="Scroll Right"
        icon={<FaChevronRight />}
        position="absolute"
        right="20px"
        top="50%"
        transform="translateY(-50%)"
        bg="black"
        color="white"
        _hover={{ bg: "#9D152D" }}
        zIndex="10"
        onClick={() => scroll(300)}
      />
    </Box>
  );
};

export default Gallery;
