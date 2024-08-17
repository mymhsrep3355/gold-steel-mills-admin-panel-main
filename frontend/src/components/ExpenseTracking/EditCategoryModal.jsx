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
  Input,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

const EditCategoryModal = ({ isOpen, onClose, category, updateLocalCategory }) => {
  const [categoryName, setCategoryName] = useState(category.name);
  const { token } = useAuthProvider();
  const toast = useToast();

  const handleUpdateCategory = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}categories/update/${category._id}`,
        { name: categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        updateLocalCategory(category._id, categoryName);
        toast({
          title: "Category updated successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Failed to update category.",
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
        <ModalHeader>Edit Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter new category name"
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdateCategory}>
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

export default EditCategoryModal;
