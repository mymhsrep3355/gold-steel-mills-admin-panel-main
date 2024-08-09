import React from 'react';
import { Button, Icon, Box } from '@chakra-ui/react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex="999"
    >
      <Button
        onClick={scrollToTop}
        bg="#9D152D"
        color="white"
        _hover={{ bg: "#9D152D" }}
        size="lg"
        borderRadius="full"
        boxShadow="md"
      >
        <Icon as={FaArrowUp} w={6} h={6} />
      </Button>
    </Box>
  );
};

export default ScrollToTopButton;
