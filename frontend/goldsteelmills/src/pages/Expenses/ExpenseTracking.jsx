import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  useToast,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import { AddIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";
import logo from "../../../public/logo.jpeg";
import { PageHeader } from "../../components/PageHeader";

const ExpenseTracking = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  const toast = useToast();
  const componentRef = useRef();

  const addCategory = () => {
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const addExpenseRow = (category) => {
    const expense = {
      category: category,
      date: "",
      description: "",
      amount: 0,
    };
    setExpenses([...expenses, expense]);
  };

  const updateExpense = (index, field, value) => {
    const updatedExpenses = expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    setExpenses(updatedExpenses);
  };

  const calculateSubtotal = () => {
    let subtotal = 0;
    expenses.forEach((expense) => {
      subtotal += parseFloat(expense.amount) || 0;
    });
    return subtotal.toFixed(2);
  };

  const filterExpensesByCategory = (category) => {
    return expenses.filter((expense) => expense.category === category);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <PageHeader title="Expense Tracking" />

      <Container
        ref={componentRef}
        bg="white"
        p={8}
        mt={4}
        rounded="lg"
        shadow="lg"
        width="100%"
        maxW="1000px"
      >
          <Flex justifyContent="space-between" mb={8}>
            <Image src={logo} alt="Factory Logo" boxSize="80px" />
            <VStack align="flex-start">
              <Heading as="h1" size="lg" color="gray.700">
                White Gold Steel Industry
              </Heading>
              <Text color="gray.500">Glotian Mor, Daska</Text>
            </VStack>
          </Flex>

          <FormControl mb={4}>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>New Category</FormLabel>
            <Flex>
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button ml={2} bg="teal.600" onClick={addCategory}>
                <Text color={"white"}>Add Category</Text>
              </Button>
            </Flex>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Select Category</FormLabel>
            <Select
              placeholder="-- All Categories --"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormControl>

          <Box mb={6}>
            {categories.map((category, categoryIndex) => (
              <Box key={categoryIndex} mb={4}>
                <Heading size="md" color="blue.500" mt={4} mb={2}>
                  {category}
                </Heading>
                <Table variant="simple" colorScheme="blue">
                  <Thead bg="teal.600">
                    <Tr>
                      <Th color="white">#</Th>
                      <Th color="white">Date</Th>
                      <Th color="white">Expense Description</Th>
                      <Th color="white">Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filterExpensesByCategory(category).map(
                      (expense, expenseIndex) => (
                        <Tr key={expenseIndex}>
                          <Td>{expenseIndex + 1}</Td>
                          <Td>
                            <Input
                              type="date"
                              value={expense.date}
                              onChange={(e) =>
                                updateExpense(
                                  expenseIndex,
                                  "date",
                                  e.target.value
                                )
                              }
                            />
                          </Td>
                          <Td>
                            <Input
                              type="text"
                              placeholder="Expense Description"
                              value={expense.description}
                              onChange={(e) =>
                                updateExpense(
                                  expenseIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </Td>
                          <Td>
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={expense.amount}
                              onChange={(e) =>
                                updateExpense(
                                  expenseIndex,
                                  "amount",
                                  e.target.value
                                )
                              }
                            />
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                  <tfoot>
                    <Tr>
                      <Td colSpan="3" textAlign="right" fontWeight="bold">
                        Total:
                      </Td>
                      <Td fontWeight="bold">
                        {filterExpensesByCategory(category)
                          .reduce(
                            (total, expense) =>
                              total + (parseFloat(expense.amount) || 0),
                            0
                          )
                          .toFixed(2)}
                      </Td>
                    </Tr>
                  </tfoot>
                </Table>
                <Button
                  leftIcon={<AddIcon color={"white"} />}
                  bg={"teal.600"}
                  onClick={() => addExpenseRow(category)}
                  mt={4}
                >
                  <Text color={"white"}>Add Expense</Text>
                </Button>
              </Box>
            ))}
          </Box>

          <Box mt={4} fontSize="xl" fontWeight="bold" color="teal.600">
            Subtotal: {calculateSubtotal()}
          </Box>

          <Button mt={5} bg="teal.600" onClick={handlePrint}>
            <Text color={"white"}>Print/Save</Text>
          </Button>
        </Container>

    </>
  );
};

export default ExpenseTracking;
