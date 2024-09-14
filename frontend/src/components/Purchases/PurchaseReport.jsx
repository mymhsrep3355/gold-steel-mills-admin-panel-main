// src/components/Purchases/PurchaseReport.jsx
import React, { useRef } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  Flex,
  Divider,
  Button,
  Image,
} from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../public/logo.jpeg"; // Adjust path according to your project structure

const PurchaseReport = ({ purchase }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: auto;
        margin: 20mm;
      }
      @media print {
        body {
          font-size: 12pt;
          color: black;
        }
        .print-table th, .print-table td {
          padding: 8px;
          font-size: 10pt;
          border: 1px solid black;
        }
        .print-table th {
          background-color: #4A5568;
          color: white;
        }
      }
    `,
  });

  return (
    <Box
      ref={componentRef}
      p={5}
      maxWidth="900px"
      margin="0 auto"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      border="1px solid #e2e8f0"
      mb={8}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
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
      </Flex>

      <Divider mb={4} />

      {/* Purchase Information */}
      <Box mb={6}>
        <Text fontWeight="bold" fontSize="lg">
          Supplier Name:{" "}
          <span style={{ fontWeight: "normal" }}>
            {purchase.supplier.firstName} {purchase.supplier.lastName}
          </span>
        </Text>
        <Text fontWeight="bold" fontSize="lg">
          Purchase Date:{" "}
          <span style={{ fontWeight: "normal" }}>
            {new Date(purchase.date).toLocaleDateString()}
          </span>
        </Text>
      </Box>

      <Table variant="simple" size="sm" colorScheme="teal" mb={6} className="print-table">
        <Thead bg="teal.600">
          <Tr>
            <Th color="white">Item Name</Th>
            <Th color="white" isNumeric>
              Quantity
            </Th>
            <Th color="white" isNumeric>
              Price
            </Th>
            <Th color="white" isNumeric>
              Total
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {purchase.items.map((item, index) => (
            <Tr key={index}>
              <Td>{item.name}</Td>
              <Td isNumeric>{item.quantity}</Td>
              <Td isNumeric>{item.price.toLocaleString()}</Td>
              <Td isNumeric>{(item.quantity * item.price).toLocaleString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justifyContent="space-between" mt={10}>
        <Box textAlign="center" w="45%">
          <Divider />
          <Text mt={2}>Signature of CEO</Text>
        </Box>
        <Box textAlign="center" w="45%">
          <Divider />
          <Text mt={2}>Receiver</Text>
        </Box>
      </Flex>

      {/* Print Button */}
      <Button mt={4} colorScheme="teal" onClick={handlePrint}>
        Print Report
      </Button>
    </Box>
  );
};

export default PurchaseReport;
