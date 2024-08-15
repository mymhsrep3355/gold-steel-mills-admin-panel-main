import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
  Image,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../public/logo.jpeg";
import { PageHeader } from "../../components/PageHeader";

import CategoryInput from "../../components/ExpenseTracking/CategoryInput";
import CategoryTable from "../../components/ExpenseTracking/CategoryTable";
import ExpenseTable from "../../components/ExpenseTracking/ExpenseTable";
import CategorySelect from "../../components/ExpenseTracking/CategorySelect";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

const ExpenseTracking = () => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const { token } = useAuthProvider();
  const toast = useToast();
  const componentRef = useRef();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

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
          setSelectedCategoryId(response?.data[0]?._id);
          console.log(selectedCategoryId);
          console.log(response.data);
          
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Failed to fetch categories.",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
  }, [token, toast]);

  console.log(categories);
  

  const addCategory = (category) => {
    setCategories([...categories, category]);
  };

  const addExpenseRow = (category) => {
    const expense = {
      category: category,
      date: "",
      description: "",
      amount: 0,
    };
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
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

  const filterExpensesByCategory = () => {
    return expenses.filter(
      (expense) => expense.category === selectedCategory
    );
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <PageHeader title="Expense Tracking" />

      <Container
        ref={componentRef}
        bg={bgColor}
        p={8}
        mt={4}
        rounded="lg"
        shadow="lg"
        maxW="1000px"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Image src={logo} alt="Factory Logo" boxSize="80px" />
          <VStack align="flex-start">
            <Heading as="h1" size="lg" color={textColor}>
              White Gold Steel Industry
            </Heading>
            <Text color={subTextColor}>Glotian Mor, Daska</Text>
          </VStack>
        </Flex>

        <Divider my={6} borderColor="gray.300" />

        <CategoryInput
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          addCategory={addCategory}
        />

        <Divider my={6} borderColor="gray.300" />

        <CategorySelect
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {selectedCategory && (
          <ExpenseTable
            selectedCategoryId={selectedCategoryId}
            category={selectedCategory}
            expenses={expenses}
            addExpenseRow={addExpenseRow}
            updateExpense={updateExpense}
            filterExpensesByCategory={filterExpensesByCategory}
          />
        )}

        <Divider my={6} borderColor="gray.300" />

        <CategoryTable categories={categories} setCategories={setCategories} />

        <Box mt={6} fontSize="2xl" fontWeight="bold" color="teal.600" textAlign="right">
          Subtotal: {calculateSubtotal()}
        </Box>

        <Button mt={5} bg="teal.600" onClick={handlePrint} size="lg">
          <Text color={"white"}>Print/Save</Text>
        </Button>
      </Container>
    </>
  );
};

export default ExpenseTracking;
