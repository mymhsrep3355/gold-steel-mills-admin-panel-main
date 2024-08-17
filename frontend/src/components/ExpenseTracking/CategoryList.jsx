import React from "react";
import { Box, Flex, Button, Text, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

const CategoryList = ({ categories, handleEdit, handleDelete }) => {
  return (
    <Box>
      {categories.map((category, index) => (
        <Flex key={index} justifyContent="space-between" alignItems="center" mb={2}>
          <Text fontSize="lg">{category}</Text>
          <Box>
            <IconButton
              icon={<EditIcon />}
              colorScheme="blue"
              onClick={() => handleEdit(category)}
              mr={2}
            />
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={() => handleDelete(category)}
            />
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default CategoryList;
