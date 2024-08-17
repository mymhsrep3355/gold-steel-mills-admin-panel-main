import React from "react";
import { Box, Heading, Divider } from "@chakra-ui/react";

export const PageHeader = ({ title }) => {
  return (
    <Box
      bg="gray.800"
      p={2}
      rounded="lg"
      shadow="md"
      textAlign="center"
      position="relative"
    >
      <Heading as="h1" size="lg" color="white" fontWeight="semibold">
        {title}
      </Heading>
    </Box>
  );
};
