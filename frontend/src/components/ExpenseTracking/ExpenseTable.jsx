import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Heading,
  IconButton,
  Flex,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";


const ExpenseTable = ({
    selectedCategoryId,
  category,
  expenses,
  addExpenseRow,
  updateExpense,
  filterExpensesByCategory,
  handleEdit,
  handleDelete,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const filteredExpenses = filterExpensesByCategory();
    const { token } = useAuthProvider();
  const tableBg = useColorModeValue("gray.100", "gray.700");
  const headerBg = useColorModeValue("teal.600", "teal.800");
  const headerTextColor = useColorModeValue("white", "gray.100");

  const saveExpenses = async () => {
    setIsSaving(true);

    try {
      for (const expense of filteredExpenses) {
        const data = {
          category : selectedCategoryId,
          amount: parseFloat(expense.amount),
          date: expense.date,
          description: expense.description,
        };

        await axios.post(`${BASE_URL}expenses/register`, data, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      }

      toast({
        title: "Expenses saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      
      window.location.reload();
    } catch (error) {
      console.error("Error saving expenses:", error);
      toast({
        title: "Failed to save expenses.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box mb={4} rounded="md" p={4} bg={tableBg} shadow="md">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="md" color="blue.500">
          {category}
        </Heading>
        <Box>
          <IconButton
            icon={<EditIcon />}
            colorScheme="blue"
            onClick={() => handleEdit(category)}
            mr={2}
          />
          <IconButton
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={() => handleDelete(category)}
          />
        </Box>
      </Flex>
      <Table variant="striped" colorScheme="teal" size="md">
        <Thead bg={headerBg}>
          <Tr>
            <Th color={headerTextColor}>#</Th>
            <Th color={headerTextColor}>Date</Th>
            <Th color={headerTextColor}>Expense Description</Th>
            <Th color={headerTextColor}>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredExpenses.map((expense, expenseIndex) => (
            <Tr key={expenseIndex}>
              <Td>{expenseIndex + 1}</Td>
              <Td>
                <Input
                  type="date"
                  value={expense.date}
                  onChange={(e) =>
                    updateExpense(expenseIndex, "date", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  type="text"
                  placeholder="Expense Description"
                  value={expense.description}
                  onChange={(e) =>
                    updateExpense(expenseIndex, "description", e.target.value)
                  }
                />
              </Td>
              <Td>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={expense.amount}
                  onChange={(e) =>
                    updateExpense(expenseIndex, "amount", e.target.value)
                  }
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex mt={4} justifyContent="space-between">
        <Button
          leftIcon={<AddIcon color={"white"} />}
          bg={"teal.600"}
          onClick={() => addExpenseRow(category)}
          size="sm"
          colorScheme="teal"
        >
          <Text color={"white"}>Add Expense</Text>
        </Button>
        <Button
          bg={"blue.600"}
          color={"white"}
          size="sm"
          onClick={saveExpenses}
          isLoading={isSaving}
          loadingText="Saving..."
        >
          Save Expenses
        </Button>
      </Flex>
    </Box>
  );
};

export default ExpenseTable;
