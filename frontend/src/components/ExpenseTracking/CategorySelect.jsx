import React, { useEffect, useState } from "react";
import { FormControl, FormLabel, Select, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

const CategorySelect = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const { token } = useAuthProvider();
//   console.log(token);
  
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const categoryData = response.data;
        //   console.log(categoryData);
          
          setCategories(categoryData || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Failed to fetch categories.",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
  }, [token, toast]);

  return (
    <FormControl mb={4}>
      <FormLabel>Select Category</FormLabel>
      <Select
        placeholder="-- All Categories --"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
