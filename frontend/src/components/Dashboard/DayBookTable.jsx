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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaRecycle } from "react-icons/fa";
import { Flex } from "@chakra-ui/react";

const DaybookTable = ({ daybooks, onEdit, onDelete, initialBalance = 0 }) => {
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const sortedDaybooks = useMemo(() => {
    return [...daybooks].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [daybooks, refresh]);

  const {
    transactionsWithBalance,
    totalDebit,
    totalCredit,
    finalBalance,
  } = useMemo(() => {
    setLoading(true); // Start loading when calculations are made
    let balance = initialBalance;
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

    setLoading(false); // End loading after calculations are done

    return {
      transactionsWithBalance: transactions,
      totalDebit,
      totalCredit,
      finalBalance: balance,
    };
  }, [sortedDaybooks, initialBalance, refresh]);

  useEffect(() => {
    // Simulate data fetching delay
    setLoading(true);
    setTimeout(() => setLoading(false), 500); // Adjust the timeout as needed
  }, [refresh]);

  return (
    <Box mt={8} overflowX="auto">
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" mb={4} fontWeight="bold">
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

      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" color="teal"/>
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
