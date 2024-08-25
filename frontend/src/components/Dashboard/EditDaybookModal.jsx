import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const EditDaybookModal = ({ isOpen, onClose, daybook, onUpdated }) => {
  const { token } = useAuthProvider();
  const toast = useToast();
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    type: "credit",
  });

  useEffect(() => {
    if (daybook) {
      setFormData({
        date: new Date(daybook.date).toISOString().split("T")[0],
        description: daybook.description,
        amount: daybook.amount,
        type: daybook.type,
      });
    }
  }, [daybook]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}daybook/update/${daybook._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Daybook entry updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onUpdated();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Failed to update daybook entry.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Daybook Entry</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="date" isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="description" isRequired mt={4}>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="amount" isRequired mt={4}>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl id="type" isRequired mt={4}>
            <FormLabel>Type</FormLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </Select>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditDaybookModal;
