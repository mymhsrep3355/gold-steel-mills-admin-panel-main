import React from "react";
import {
  Flex,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";
import { BASE_URL } from "../../utils.js";
import axios from "axios";

const CategoryInput = ({
  newCategory,
  setNewCategory,
  addCategory,
  isEditing,
  updateCategory,
}) => {
  const { token } = useAuthProvider();
  const toast = useToast();
  const bgInput = useColorModeValue("white", "gray.700");

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        const response = await axios.post(
          `${BASE_URL}categories/register`,
          { name: newCategory },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          addCategory(response.data);
          setNewCategory("");
          toast({
            title: "Category added successfully.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
          window.location.reload();
        }
      } catch (error) {
        console.error("Error adding category:", error);
        toast({
          title: "Failed to add category.",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Category name is empty.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <FormControl mb={4}>
      <FormLabel>{isEditing ? "Edit Category" : "New Category"}</FormLabel>
      <Flex>
        <Input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          bg={bgInput}
        />
        <Button
          ml={2}
          bg="teal.600"
          onClick={isEditing ? updateCategory : handleAddCategory}
        >
          <Text color={"white"}>{isEditing ? "Update" : "Add Category"}</Text>
        </Button>
      </Flex>
    </FormControl>
  );
};

export default CategoryInput;
