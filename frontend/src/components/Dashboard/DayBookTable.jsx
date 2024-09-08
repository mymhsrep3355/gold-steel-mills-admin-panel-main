import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  IconButton,
  Text,
  Button,
  Spinner,
  Input,
  Flex,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaRecycle, FaCalendarDay } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import DaybookEntryState from "../../atoms/DaybookEntryState";
import OpeningBalanceState from "../../atoms/OpeningBalanceState";

const isValidDate = (date) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

const DaybookTable = ({ daybooks, onEdit, onDelete, initialBalance = 0, refresh, setRefresh }) => {
  const newDaybookEntry = useRecoilValue(DaybookEntryState);

const openingBalance = useRecoilValue(OpeningBalanceState)



  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Include the new daybook entry if it's not null
  const updatedDaybooks = useMemo(() => {
    return newDaybookEntry ? [...daybooks, newDaybookEntry] : daybooks;
  }, [daybooks, newDaybookEntry]);

  // Filter and sort the daybooks based on the selected date
  const filteredDaybooks = useMemo(() => {
    return updatedDaybooks.filter((entry) => {
      if (!entry.date || !isValidDate(entry.date)) {
        return false;
      }
      const entryDate = new Date(entry.date).toISOString().split('T')[0];
      return entryDate === selectedDate;
    });
  }, [updatedDaybooks, selectedDate]);

  const sortedDaybooks = useMemo(() => {
    return [...filteredDaybooks].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredDaybooks]);

  const {
    transactionsWithBalance,
    totalDebit,
    totalCredit,
    finalBalance,
  } = useMemo(() => {
    setLoading(true);
    let balance = Number(initialBalance);
    let totalDebit = 0;
    let totalCredit = 0;

    const transactions = sortedDaybooks.map((entry) => {
      const amount = entry.amount;
      if (entry.type === "debit") {
        balance -= amount;
        totalDebit += amount;
      } else if (entry.type === "credit") {
        balance += amount;
        totalCredit += amount;
      }

      return {
        ...entry,
        debit: entry.type === "debit" ? amount : null,
        credit: entry.type === "credit" ? amount : null,
        balance,
      };
    });

    setLoading(false);

    return {
      transactionsWithBalance: transactions,
      totalDebit,
      totalCredit,
      finalBalance: balance,
    };
  }, [sortedDaybooks, initialBalance]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, [refresh]);

  return (
    <Box mt={8} overflowX="auto">
      <Flex direction="column" mb={4}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Daybook Ledger
          </Text>
          <Button
            leftIcon={<FaRecycle />}
            colorScheme="teal"
            size="md"
            onClick={() => setRefresh(!refresh)}
          >
            Refresh
          </Button>
        </Flex>

        <Flex mb={4} align="center">
          <IconButton
            aria-label="Select Date"
            icon={<FaCalendarDay />}
            mr={2}
            size="sm"
            variant="outline"
            colorScheme="blue"
          />
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            size="md"
          />
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" color="teal" />
        </Flex>
      ) : (
        <Table variant="striped" colorScheme="teal" size="md">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th isNumeric>Debit (PKR)</Th>
              <Th isNumeric>Credit (PKR)</Th>
              <Th isNumeric>Balance (PKR)</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactionsWithBalance.map((entry) => (
              <Tr key={entry._id}>
                <Td>{new Date(entry.date).toLocaleDateString()}</Td>
                <Td>{entry.description}</Td>
                <Td isNumeric>
                  {entry.debit ? entry.debit.toLocaleString() : "-"}
                </Td>
                <Td isNumeric>
                  {entry.credit ? entry.credit.toLocaleString() : "-"}
                </Td>
                <Td isNumeric>{entry.balance.toLocaleString()}</Td>
                <Td>
                  <IconButton
                    aria-label="Edit entry"
                    icon={<EditIcon />}
                    mr={2}
                    onClick={() => onEdit(entry)}
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                  />
                  <IconButton
                    aria-label="Delete entry"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(entry._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Total</Th>
              <Th></Th>
              <Th isNumeric>{totalDebit.toLocaleString()}</Th>
              <Th isNumeric>{totalCredit.toLocaleString()}</Th>
              <Th isNumeric>{finalBalance.toLocaleString()}</Th>
              <Th></Th>
            </Tr>
          </Tfoot>
        </Table>
      )}
    </Box>
  );
};

export default DaybookTable;
