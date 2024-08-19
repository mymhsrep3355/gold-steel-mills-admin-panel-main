import React from "react";
import { Box, Text, VStack, useColorModeValue } from "@chakra-ui/react";
import { Card } from "antd";

const InfoCard = ({ title, totalNumber, bgColor = "#ffffff" }) => {
  const cardBgColor = useColorModeValue(bgColor, "#1A202C"); // Adjust background based on light/dark mode
  const textColor = useColorModeValue("gray.800", "white"); // Adjust text color based on light/dark mode

  return (
    <Card
      style={{
        borderRadius: "15px",
        backgroundColor: cardBgColor,
        width: "300px",
        textAlign: "left",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for elevation
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-r, rgba(255, 255, 255, 0.5), transparent)"
        zIndex="0"
      />
      <VStack align="flex-start" spacing={4} zIndex="1" position="relative">
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          {title}
        </Text>
        <Text fontSize="4xl" fontWeight="bold" color={textColor}>
          {totalNumber}
        </Text>
      </VStack>
    </Card>
  );
};

export default InfoCard;
