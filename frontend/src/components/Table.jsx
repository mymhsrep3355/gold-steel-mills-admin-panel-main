import React, { useState } from "react";
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Button,
  Box,
  useColorModeValue,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../utils";
import { useAuthProvider } from "../hooks/useAuthProvider";

// eslint-disable-next-line react/prop-types
export const Table = ({ columns, data, deleteURL, handleNavigation, refreshData, handleViewLedger }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const toast = useToast();
  const { token } = useAuthProvider();

  console.log(data);

  const bg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((item) => item._id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDelete = async () => {
    try {
      const deletePromises = selectedItems.map((id) =>
        axios.delete(`${BASE_URL}suppliers/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    );
      await Promise.all(deletePromises);
      toast({
        title:
          selectedItems.length > 1 ? "Suppliers deleted" : "Supplier deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedItems([]);
      refreshData();
    } catch (error) {
      console.error("Error deleting suppliers:", error);
      toast({
        title: "Failed to delete suppliers",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      overflowX="auto"
      bg={bg}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
    >
      <ChakraTable variant="simple" size="md">
        <Thead bg={useColorModeValue("gray.100", "gray.700")}>
          <Tr>
            <Th>
              <Checkbox
                isChecked={
                  selectedItems.length === data.length && data.length > 0
                }
                onChange={handleSelectAll}
                colorScheme="teal"
              />
            </Th>
            {columns.map((column, index) => (
              <Th key={index} textTransform="capitalize" color="gray.600">
                {column}
              </Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, rowIndex) => (
            <Tr
              key={rowIndex}
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            >
              <Td>
                <Checkbox
                  isChecked={selectedItems.includes(item._id)}
                  onChange={() => handleSelectOne(item._id)}
                  colorScheme="teal"
                />
              </Td>
              {columns.map((column, colIndex) => (
                <Td key={colIndex} color="gray.600">
                  {column === "createdAt"
                    ? new Date(item[column]).toLocaleDateString()
                    : item[column]}
                </Td>
              ))}
              <Td>
                <Button
                  onClick={() => handleNavigation(item)}
                  colorScheme="teal"
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>

                <Button
                  onClick={() => handleViewLedger(item._id)}
                  colorScheme="teal"
                  size="sm"
                  variant="outline"
                >
                  Ledger
                </Button>

              </Td>
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
      {selectedItems.length > 0 && (
        <Box mt={4}>
          <Button onClick={handleDelete} colorScheme="red" size="md">
            {selectedItems.length > 1
              ? `Delete All (${selectedItems.length})`
              : "Delete"}
          </Button>
        </Box>
      )}
    </Box>
  );
};
