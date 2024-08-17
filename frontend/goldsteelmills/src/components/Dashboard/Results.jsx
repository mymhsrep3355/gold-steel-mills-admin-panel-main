import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

import EditDaybookModal from "./EditDaybookModal";
import DaybookTable from "./DayBookTable";

const Results = () => {
  const { token } = useAuthProvider();
  const toast = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daybooks, setDaybooks] = useState([]);
  const [selectedDaybook, setSelectedDaybook] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}daybook?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setDaybooks(response.data);
      }
    } catch (error) {
      toast({
        title: "Failed to fetch records.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleEdit = (daybook) => {
    setSelectedDaybook(daybook);
    onOpen();
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}daybook/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        fetchRecords();
      }
    } catch (error) {
      toast({
        title: "Failed to delete record.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} bg="white" boxShadow="lg" borderRadius="md">
      <VStack as="form" spacing={4} onSubmit={handleSubmit}>
        <FormControl id="startDate" isRequired>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormControl>
        <FormControl id="endDate" isRequired>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">
          Fetch Records
        </Button>
      </VStack>

      {daybooks.length > 0 && (
        <>
          <DaybookTable
            daybooks={daybooks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {selectedDaybook && (
            <EditDaybookModal
              isOpen={isOpen}
              onClose={onClose}
              daybook={selectedDaybook}
              onUpdated={fetchRecords}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Results;
