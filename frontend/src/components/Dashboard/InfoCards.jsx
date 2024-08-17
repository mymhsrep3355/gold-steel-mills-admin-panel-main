import React from "react";
import { Box, Text, VStack, Link, useColorModeValue } from "@chakra-ui/react";
import { Card } from "antd";

const InfoCard = ({ title, totalNumber, bgColor = "#ffffff"  }) => {
  return (
    <Card
      style={{
        borderRadius: "15px",
        backgroundColor: bgColor,
        width: "300px",
        textAlign: "left",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
      bodyStyle={{ padding: 0 }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgGradient="linear(to-r, white, transparent)"
        zIndex="0"
      />
      <VStack align="flex-start" spacing={4} zIndex="1" position="relative">
        <Text fontSize="md" fontWeight="bold" color="black">
          {title}
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color="black">
          {totalNumber}
        </Text>
        <Link href="#" color="black" fontSize="sm">
          View entire list
        </Link>
      </VStack>
    </Card>
  );
};

export default InfoCard;
