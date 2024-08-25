import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  IconButton,
  useBreakpointValue,
  SlideFade,
  ScaleFade,
} from "@chakra-ui/react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaAngleRight, FaChevronLeft } from "react-icons/fa6";

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 1",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1474674556023-efef886fa147?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 2",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1706874807336-c4742377b41d?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 2",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1697281679213-fcab27e10ad4?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Image 2",
  },
];

const Carousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 1000);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTextForImage = (index) => {
    switch (index) {
      case 0:
        return {
          heading: "Welcome to Factory & Industrial Business",
          description:
            "They'll have to make the best of things its an uphill climb. The weather started getting was tossed.",
        };
      case 1:
        return {
          heading: "Provide solutions to plan Industries.",
          description:
            "They'll have to make the best of things its an uphill climb. The weather started getting was tossed.",
        };
      case 2:
        return {
          heading: "Building the Future with Strength",
          description:
            "From skyscrapers to bridges, our steel forms the backbone of tomorrow's world. Quality you can trust, strength you can build on.",
        };
      case 3:
        return {
          heading: "Innovating Steel for a Stronger Tomorrow",
          description:
            "Leading the way in steel innovation, we deliver materials that exceed standards, ensuring durability and reliability in every project.",
        };
      default:
        return { heading: "", description: "" };
    }
  };

  const text = getTextForImage(currentImageIndex);

  return (
    <Box position="relative" width="100%" height="600px" overflow="hidden">
      {images.map((image, index) => (
        <Box
          key={image.id}
          as="section"
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          backgroundSize="cover"
          backgroundPosition="center"
          backgroundImage={`url(${image.src})`}
          transition="opacity 1s ease-in-out"
          opacity={index === currentImageIndex ? 1 : 0}
          zIndex={index === currentImageIndex ? 1 : 0}
        >
          {index === currentImageIndex && (
            <SlideFade in={true} offsetX="-20px" offsetY="0px">
              <Flex
                direction="column"
                justify="center"
                align="flex-start"
                height="100%"
                w={"50%"}
                mt={"150px"}
                p={4}
                ml={"100px"}
                bg="rgba(0, 0, 0, 0.5)"
                px={useBreakpointValue({ base: 4, md: 8 })}
                textAlign="left"
                pl={useBreakpointValue({ base: 4, md: 16 })}
              >
                <Text
                  fontSize={useBreakpointValue({ base: "2xl", md: "4xl" })}
                  fontWeight="500"
                  color="white"
                  mb={4}
                >
                  {text.heading}
                </Text>
                <Text
                  fontSize={useBreakpointValue({ base: "md", md: "md" })}
                  color="white"
                  mb={6}
                >
                  {text.description}
                </Text>
                <Stack direction="row" spacing={4}>
                  <ScaleFade in={true} initialScale={0.8}>
                    <Button
                      bg="#9D152D"
                      color="white"
                      _hover={{ bg: "red.700" }}
                      size="md"
                    >
                      ABOUT US
                    </Button>
                  </ScaleFade>
                  <ScaleFade in={true} initialScale={0.8}>
                    <Button
                      bg="black"
                      color="white"
                      _hover={{ bg: "gray.800" }}
                      size="md"
                    >
                      CONTACT US
                    </Button>
                  </ScaleFade>
                </Stack>
              </Flex>
            </SlideFade>
          )}
        </Box>
      ))}

      <IconButton
        aria-label="Previous Slide"
        icon={<FaChevronLeft />}
        position="absolute"
        left="10px"
        top="50%"
        transform="translateY(-50%)"
        bg="black"
        color="white"
        _hover={{ bg: "#9D152D" }}
        zIndex="10"
        onClick={handlePrev}
      />

      <IconButton
        aria-label="Next Slide"
        icon={<FaAngleRight />}
        position="absolute"
        right="10px"
        top="50%"
        transform="translateY(-50%)"
        bg="black"
        color="white"
        _hover={{ bg: "#9D152D" }}
        zIndex="10"
        onClick={handleNext}
      />
    </Box>
  );
};

export default Carousel;
