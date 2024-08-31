import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot, // Import Tfoot for the footer section
  Tr,
  Th,
  Td,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils.js";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";

const SupplierLedger = () => {
  const location = useLocation();
  const { supplierId } = location.state || {}; // Access supplierId from navigation state
  const { token } = useAuthProvider();
  const [ledgerData, setLedgerData] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0); // State for total debit
  const [totalCredit, setTotalCredit] = useState(0); // State for total credit
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

  return (
    <Box p={5}>
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
        <Table variant="striped" colorScheme="teal">
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
            {ledgerData?.map((entry, index) => (
              <Tr key={index}>
                <Td>{new Date(entry.date).toLocaleDateString()}</Td>
                <Td>{entry.description? entry.description : "-"}</Td>
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
      )}
    </Box>
  );
};

export default SupplierLedger;
