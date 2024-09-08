import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Container,
  Text,
  Input,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import DaybookForm from "./DaybookForm";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";
import DaybookTable from "./DayBookTable";
import EditDaybookModal from "./EditDaybookModal";


const FinancialBook = () => {
  const { token } = useAuthProvider();
  const [daybooks, setDaybooks] = useState([]);
  const [todayEntries, setTodayEntries] = useState([]); // State for today's entries
  const [selectedDaybook, setSelectedDaybook] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
const [refresh , setRefresh]= useState(false)

  const [openingBalance, setOpeningBalance] = useState(0); // State for the opening balance
  const [currentTotal, setCurrentTotal] = useState(0); // State for the current day's total

  // Fetch all daybook entries
  const fetchDaybooks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}daybook`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setDaybooks(response.data);
        filterTodayEntries(response.data);
        setOpeningBalanceFromLastEntry(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch daybooks:", error);
    }
  };

  // Filter today's entries
  const filterTodayEntries = (entries) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const todayEntries = entries.filter(
      (entry) => new Date(entry.date).setHours(0, 0, 0, 0) === today
    );
    setTodayEntries(todayEntries);
  };

  // Set the opening balance from the last daybook entry before today
  const setOpeningBalanceFromLastEntry = (entries) => {
    // Commented out the logic to avoid errors; ensure it works as needed
    // const today = new Date().setHours(0, 0, 0, 0);
    // const previousEntries = entries.filter(
    //   (entry) => new Date(entry.date).setHours(0, 0, 0, 0) < today
    // );
    // if (previousEntries.length > 0) {
    //   const lastDaybook = previousEntries[previousEntries.length - 1];
    //   setOpeningBalance(lastDaybook.balance || 0);
    // }
  };

  // Handle edits to the daybook entries
  const handleEdit = (daybook) => {
    setSelectedDaybook(daybook);
    onOpen();
  };

  // Handle deletion of daybook entries
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}daybook/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        fetchDaybooks();
      }
    } catch (error) {
      console.error("Failed to delete daybook entry:", error);
    }
  };

  // Update the current total when the opening balance changes or today's entries change
  useEffect(() => {
    // Safely calculate today's total debit and credit
    const todayTotal = todayEntries.reduce((total, entry) => {
      const debit = parseFloat(entry.debit) || 0;
      const credit = parseFloat(entry.credit) || 0;
      return total + debit - credit;
    }, 0);

    setCurrentTotal(todayTotal + parseFloat(openingBalance) || 0);
  }, [todayEntries, openingBalance]);

  useEffect(() => {
    fetchDaybooks();
  }, [token , refresh]);

  return (
    <Container maxW="auto" mt={8} p={5} bg="white" boxShadow="lg" borderRadius="md">
      <Text fontSize="2xl" mb={6} fontWeight="bold">
        Daybook
      </Text>

      <DaybookForm  onEntryAdded={fetchDaybooks} />

      <Divider my={8} />

      <DaybookTable
      initialBalance={openingBalance} setOpeningBalance={setOpeningBalance}
       refresh={refresh} setRefresh={setRefresh} daybooks={daybooks} onEdit={handleEdit} onDelete={handleDelete} />

      {selectedDaybook && (
        <EditDaybookModal
          isOpen={isOpen}
          onClose={onClose}
          daybook={selectedDaybook}
          onUpdated={fetchDaybooks}
        />
      )}
    </Container>
  );
};

export default FinancialBook;
