import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  IconButton,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import EditCategoryModal from "./EditCategoryModal";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

const CategoryTable = ({ categories, setCategories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { token } = useAuthProvider();
  const toast = useToast();

  const tableBg = useColorModeValue("gray.100", "gray.700");
  const headerBg = useColorModeValue("teal.600", "teal.800");
  const headerTextColor = useColorModeValue("white", "gray.100");

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsEditing(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}categories/delete/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCategories(categories.filter((cat) => cat._id !== categoryId));
        toast({
          title: "Category deleted successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Failed to delete category.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateLocalCategory = (id, newName) => {
    setCategories(
      categories.map((cat) =>
        cat._id === id ? { ...cat, name: newName } : cat
      )
    );
  };

  return (
    <Box mt={6} rounded="md" p={4} bg={tableBg} shadow="md">
      <Table variant="striped" colorScheme="teal" size="md">
        <Thead bg={headerBg}>
          <Tr>
            <Th color={headerTextColor}>Category Name</Th>
            <Th color={headerTextColor}>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category._id}>
              <Td>{category.name}</Td>
              <Td>
                <IconButton
                  icon={<EditIcon />}
                  colorScheme="blue"
                  onClick={() => handleEdit(category)}
                  mr={2}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDelete(category._id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {isEditing && (
        <EditCategoryModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          category={editingCategory}
          updateLocalCategory={updateLocalCategory}
        />
      )}
    </Box>
  );
};

export default CategoryTable;
