// src/components/Items/ItemReport.jsx
import React from 'react';
import { Box, Text, Image, Heading, Divider } from '@chakra-ui/react';
import logo from '../../../public/logo.jpeg'; // Replace with your actual logo path

const ItemReport = ({ item }) => {
  if (!item) return null;

  return (
    <Box
      p={5}
      maxWidth="800px"
      margin="0 auto"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      border="1px solid #e2e8f0"
    >
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Image src={logo} alt="Company Logo" boxSize="100px" />
        <Box textAlign="right">
          <Heading as="h2" size="lg" color="teal.600">
            White Gold Steel Industry
          </Heading>
          <Text fontSize="md" color="gray.600">
            Glotian Mor, Daska
          </Text>
          <Text fontSize="sm" color="gray.500">
            Phone: +92-305-6148001
          </Text>
          <Text fontSize="sm" color="gray.500">
            Email: info@whitegoldsteel.com
          </Text>
        </Box>
      </Box>

      <Divider mb={4} />

      {/* Item Details Section */}
      <Box mb={6}>
        <Heading size="md" color="teal.700" mb={2}>
          Item Report
        </Heading>
        <Text fontWeight="bold" fontSize="lg">
          Item Name: <span style={{ fontWeight: 'normal' }}>{item.name}</span>
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          Stock: <span style={{ fontWeight: 'normal' }}>{item.stock}</span>
        </Text>
      </Box>

      {/* Footer Section */}
      <Box display="flex" justifyContent="space-between" mt={10}>
        <Box textAlign="center" w="45%">
          <Divider />
          <Text mt={2}>Signature of Manager</Text>
        </Box>
        <Box textAlign="center" w="45%">
          <Divider />
          <Text mt={2}>Receiver</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ItemReport;
