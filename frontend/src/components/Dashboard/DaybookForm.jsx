import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

const DaybookForm = ({ onEntryAdded }) => {
  const { token } = useAuthProvider();
  const toast = useToast();
  const [daybookData, setDaybookData] = useState({
    date: "",
    description: "",
    amount: "",
    type: "credit",
    supplierId: "",
    cash_or_bank: "cash", 
    openingBalance:0
  });
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}suppliers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setSuppliers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

    fetchSuppliers();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDaybookData({
      ...daybookData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}daybook/register`,
        daybookData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Daybook entry added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onEntryAdded(); 
      }
    } catch (error) {
      toast({
        title: "Failed to add daybook entry.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl id="date" isRequired>
          <FormLabel>Date</FormLabel>
          <Input
            type="date"
            name="date"
            value={daybookData.date}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            type="text"
            name="description"
            value={daybookData.description}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="amount" isRequired>
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            name="amount"
            value={daybookData.amount}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl id="type" isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            name="type"
            value={daybookData.type}
            onChange={handleInputChange}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </Select>
        </FormControl>
        <FormControl id="supplierId">
          <FormLabel>Supplier / Customer</FormLabel>
          <Select
            name="supplierId"
            value={daybookData.supplierId}
            onChange={handleInputChange}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.firstName} {supplier.lastName}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl id="cash_or_bank" isRequired>
          <FormLabel>Payment Method</FormLabel>
          <Select
            name="cash_or_bank"
            value={daybookData.cash_or_bank}
            onChange={handleInputChange}
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </Select>
        </FormControl>

        <FormControl id="openingBalance" isRequired>
          <FormLabel>Opening Balance</FormLabel>
          <Input
            type="number"
            name="openingBalance"
            value={daybookData.openingBalance}
            onChange={handleInputChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          Add Entry
        </Button>
      </VStack>
    </Box>
  );
};

export default DaybookForm;
