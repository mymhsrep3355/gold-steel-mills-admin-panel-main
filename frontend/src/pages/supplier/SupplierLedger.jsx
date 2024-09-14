import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Heading,
  Flex,
  Image,
  Divider,
  Button,
  Input, // Import Input for date filter
  SimpleGrid,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils.js";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";
import { useReactToPrint } from "react-to-print";
import logo from "../../../public/logo.jpeg";

const SupplierLedger = () => {
  const location = useLocation();
  const { supplierId } = location.state || {};
  const { token } = useAuthProvider();
  const [ledgerData, setLedgerData] = useState([]);
 
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierName, setSupplierName] = useState("");
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const componentRef = useRef();

  useEffect(() => {
    if (supplierId) {
      fetchLedgerData();
    } else {
      setError("Supplier ID is missing.");
      setIsLoading(false);
    }
  }, [supplierId, startDate, endDate]);

  const fetchLedgerData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}daybook/reports/supplier/${supplierId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            startDate: startDate || undefined, // Include date filters if set
            endDate: endDate || undefined,
          },
        }
      );

      const { combinedTransactions, totalDebit, totalCredit, supplier } =
        response.data;
      setLedgerData(combinedTransactions);
      setTotalDebit(totalDebit);
      setTotalCredit(totalCredit);
      if (totalDebit - totalCredit < 0) {
        setTotalBalance(0);
      }
      else {
        setTotalBalance(totalDebit - totalCredit);
      }
      setSupplierName(
        supplier.firstName + " " + supplier.lastName || "Supplier Name"
      );
    } catch (err) {
      console.error("Error fetching ledger data:", err);
      setError("Failed to load ledger data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Print functionality using react-to-print
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
      p={5}
      maxWidth="900px"
      margin="0 auto"
      bg="white"
      borderRadius="md"
      boxShadow="lg"
      border="1px solid #e2e8f0"
      mb={8}
    >
      {/* Ref for the printable area */}
      <Box ref={componentRef}>
        {/* Header Section */}
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

        {/* Date Filters */}
        <SimpleGrid columns={[1, 2]} spacing={5} mb={4}>
          <Input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </SimpleGrid>

        {/* Supplier Info Section */}
        <Box mb={6}>
          <Text fontWeight="bold" fontSize="lg">
            Supplier Name:{" "}
            <span style={{ fontWeight: "normal" }}>{supplierName}</span>
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            Date:{" "}
            <span style={{ fontWeight: "normal" }}>
              {new Date().toLocaleDateString()}
            </span>
          </Text>
        </Box>

        {isLoading ? (
          <Box textAlign="center">
            <Spinner size="xl" color="teal.500" />
            <Text>Loading Ledger...</Text>
          </Box>
        ) : error ? (
          <Box textAlign="center" my={4}>
            <Text color="red.500">{error}</Text>
          </Box>
        ) : ledgerData.length === 0 ? (
          <Text>No Ledger Data Found...</Text>
        ) : (
          <Table variant="simple" size="sm" colorScheme="teal" mb={6}>
            <Thead bg="teal.600">
              <Tr>
                <Th color="white">Date</Th>
                <Th color="white">Description</Th>
                <Th color="white" isNumeric>
                  Debit (PKR)
                </Th>
                <Th color="white" isNumeric>
                  Credit (PKR)
                </Th>
                <Th color="white" isNumeric>
                  Balance (PKR)
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {ledgerData?.map((entry, index) => (
                <Tr key={index}>
                  <Td>{new Date(entry.date).toLocaleDateString()}</Td>
                  <Td>{entry.description ? entry.description : "-"}</Td>
                  <Td isNumeric>
                    {entry.debit ? entry.debit.toLocaleString() : "-"}
                  </Td>
                  <Td isNumeric>
                    {entry.credit ? entry.credit.toLocaleString() : "-"}
                  </Td>
                  <Td isNumeric>{entry.credit - entry.debit}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total</Th>
                <Th>-</Th>
                <Th isNumeric>{totalDebit.toLocaleString()}</Th>
                <Th isNumeric>{totalCredit.toLocaleString()}</Th>
                <Th isNumeric>{totalBalance.toLocaleString()}</Th>
              </Tr>
            </Tfoot>
          </Table>
        )}

        {/* Footer Section */}
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
      </Box>

      {/* Print Button */}
      <Button mt={4} colorScheme="teal" onClick={handlePrint}>
        Print Ledger
      </Button>
    </Box>
  );
};

export default SupplierLedger;
