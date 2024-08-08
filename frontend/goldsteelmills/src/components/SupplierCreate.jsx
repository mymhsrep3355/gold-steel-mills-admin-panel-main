import React, { useState } from 'react';
import axios from 'axios';
import { Forms } from '../Forms.js';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Text,
} from '@chakra-ui/react';

export const SupplierCreate = () => {
  const [error, setError] = useState('');

  const handleSupplierCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const res = await axios.post('supplier/store', {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        contactNumber: formData.get('contactNumber'),
      });

      if (res.status === 201) {
        alert('Supplier added successfully.');
      }
    } catch (e) {
      console.log(e);
      setError(e.response.data.error);
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="8" p="6" bg="white" boxShadow="lg" borderRadius="md">
      <form onSubmit={handleSupplierCreate}>
        <VStack spacing={4}>
          {Forms.SUPPLIER_CREATE.map((field, index) => (
            <FormControl key={index} isRequired>
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                focusBorderColor="blue.400"
                errorBorderColor="red.300"
              />
            </FormControl>
          ))}
          <Button type="submit" bg="teal.600" width="full">
            <Text color="white">
                Create
            </Text>
          </Button>
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertTitle mr={2}>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </VStack>
      </form>
    </Box>
  );
};
