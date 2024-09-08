import React, { useState, useEffect } from "react";
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
  Button,
  Flex,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils.js";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";
import logo from "../../../public/logo.jpeg"; // Path to your logo image

const SupplierLedger = () => {
  const location = useLocation();
  const { supplierId, supplier } = location.state || {}; // Access supplierId and supplier from navigation state
  const { token } = useAuthProvider();
  const [ledgerData, setLedgerData] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (supplierId) {
      fetchLedgerData();
    } else {
      setError("Supplier ID is missing.");
      setIsLoading(false);
    }
  }, [supplierId]);

  const fetchLedgerData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}daybook/reports/supplier/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      const { combinedTransactions, totalDebit, totalCredit } = response.data;
      setLedgerData(combinedTransactions);
      setTotalDebit(totalDebit);
      setTotalCredit(totalCredit);
      setTotalBalance(totalDebit - totalCredit);
    } catch (err) {
      console.error("Error fetching ledger data:", err);
      setError("Failed to load ledger data.");
    } finally {
      setIsLoading(false);
    }
  };

  const printLedger = () => {
    window.print();
  };

  return (
    <Box p={5} className="print-section">
      {/* Top section with logo and supplier name */}
      <Flex
        justify="space-between"
        align="center"
        mb={4}
        borderBottom="1px solid gray"
        pb={4}
      >
        <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
        <Text fontSize="xl" fontWeight="bold">
          {`${supplier.firstName} ${supplier.lastName}`}
        </Text>
      </Flex>

      {/* Main content */}
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
        <Box>
          <Table variant="striped" colorScheme="teal" size="sm">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th isNumeric>Debit (PKR)</Th>
                <Th isNumeric>Credit (PKR)</Th>
                <Th isNumeric>Balance (PKR)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ledgerData.map((entry, index) => (
                <Tr key={index}>
                  <Td>{new Date(entry.date).toLocaleDateString()}</Td>
                  <Td>{entry.description || "-"}</Td>
                  <Td isNumeric>{entry.debit ? entry.debit.toLocaleString() : "-"}</Td>
                  <Td isNumeric>{entry.credit ? entry.credit.toLocaleString() : "-"}</Td>
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
        </Box>
      )}

      {/* Print button */}
      <Flex justify="center" mt={6}>
        <Button onClick={printLedger} colorScheme="teal">
          Print Ledger
        </Button>
      </Flex>

      {/* CSS for A4 printing */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            width: 210mm; /* A4 width */
            height: 297mm; /* A4 height */
            overflow: hidden; /* Hide overflow */
          }
          .print-section {
            display: block;
            page-break-before: always;
          }
          @page {
            size: A4;
            margin: 10mm; /* Adjust margins as needed */
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </Box>
  );
};

export default SupplierLedger;
