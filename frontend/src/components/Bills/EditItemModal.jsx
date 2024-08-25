import React, { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const EditItemModal = ({ isOpen, onClose, item, fetchItems }) => {
  const [name, setName] = useState(item.name);
  const [stock, setStock] = useState(item.stock);
  const toast = useToast();
  const { token } = useAuthProvider();

  const handleUpdateItem = async () => {
    try {
      await axios.put(
        `${BASE_URL}items/update/${item._id}`,
        { name, stock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Item updated successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchItems();
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
      toast({
        title: "Failed to update item.",
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
        <ModalHeader>Edit Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Item Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item Name"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Stock</FormLabel>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              placeholder="Stock"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleUpdateItem}>
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

export default EditItemModal;
