import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Input,
  Flex,
  IconButton,
  useToast,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const ExpenseResults = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const { token } = useAuthProvider();
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}expenses?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast({
        title: "Failed to fetch expenses.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`${BASE_URL}expenses/delete/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
      toast({
        title: "Expense deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Failed to delete expense.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (expense) => {
    if (expense) {
      setEditingExpense({
        ...expense,
        category: expense.category ? expense.category._id : "",
      });
      setIsEditing(true);
    }
  };
  const handleUpdateExpense = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}expenses/update/${editingExpense._id}`,
        {
          ...editingExpense,
          category: editingExpense.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setExpenses(
          expenses.map((expense) =>
            expense._id === editingExpense._id ? editingExpense : expense
          )
        );
        toast({
          title: "Expense updated successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Failed to update expense.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Flex mb={4} justifyContent="space-between">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          ml={4}
        />
        <Button ml={4} colorScheme="teal" onClick={fetchExpenses}>
          Fetch Results
        </Button>
      </Flex>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Category</Th>
            <Th>Amount</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {expenses.map((expense) => (
            <Tr key={expense._id}>
              <Td>{new Date(expense.date).toLocaleDateString()}</Td>
              <Td>{expense.description}</Td>
              <Td>
                {expense.category ? expense.category.name : "No Category"}
              </Td>
              <Td>{expense.amount}</Td>
              <Td>
                <IconButton
                  icon={<EditIcon />}
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleEdit(expense)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDelete(expense._id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="date"
              value={
                editingExpense?.date
                  ? new Date(editingExpense.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  date: e.target.value,
                })
              }
              mb={4}
            />
            <Input
              placeholder="Description"
              value={editingExpense?.description || ""}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  description: e.target.value,
                })
              }
              mb={4}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={editingExpense?.amount || ""}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  amount: e.target.value,
                })
              }
              mb={4}
            />
            <Select
              placeholder="Select category"
              value={editingExpense?.category || ""}
              onChange={(e) =>
                setEditingExpense({
                  ...editingExpense,
                  category: e.target.value,
                })
              }
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleUpdateExpense}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      )}
    </Box>
  );
};

export default ExpenseResults;
