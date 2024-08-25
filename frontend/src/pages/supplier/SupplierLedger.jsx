import React, { useState, useEffect } from "react";
import {
  Box,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils.js";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";
import DaybookTable from "../../components/Dashboard/DayBookTable.jsx";


const SupplierLedger = () => {
  const location = useLocation();
  const { supplierId } = location.state || {}; // Access supplierId from navigation state
  const { token } = useAuthProvider();
  const [ledgerData, setLedgerData] = useState([]);
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

      setLedgerData(response.data);
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
        <DaybookTable daybooks={ledgerData} initialBalance={0} />
      )}
    </Box>
  );
};

export default SupplierLedger;
