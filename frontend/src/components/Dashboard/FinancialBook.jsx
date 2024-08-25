import React, { useState, useEffect } from "react";
import { Box, Divider, Container, Text, useDisclosure } from "@chakra-ui/react";
import DaybookForm from "./DaybookForm";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";
import DaybookTable from "./DayBookTable";
import EditDaybookModal from "./EditDaybookModal";

const FinancialBook = () => {
  const { token } = useAuthProvider();
  const [daybooks, setDaybooks] = useState([]);
  const [selectedDaybook, setSelectedDaybook] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchDaybooks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}daybook`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setDaybooks(response.data);
        console.log(daybooks);
        console.log(response.data);

        
        
      }
    } catch (error) {
      console.error("Failed to fetch daybooks:", error);
    }
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
        fetchDaybooks();
      }
    } catch (error) {
      console.error("Failed to delete daybook entry:", error);
    }
  };

  useEffect(() => {
    fetchDaybooks();
  }, [token]);

  return (
    <Container maxW="auto" mt={8} p={5} bg="white" boxShadow="lg" borderRadius="md">
      <Text fontSize="2xl" mb={6} fontWeight="bold">
        Daybook
      </Text>

      <DaybookForm onEntryAdded={fetchDaybooks} />

      <Divider my={8} />

      <DaybookTable daybooks={daybooks} onEdit={handleEdit} onDelete={handleDelete} />

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
