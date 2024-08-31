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
  useToast,
} from '@chakra-ui/react';
import { BASE_URL } from '../utils.js';
import { useAuthProvider } from '../hooks/useAuthProvider.js';

export const SupplierCreate = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  const { token } = useAuthProvider();

  console.log(token);

  const handleSupplierCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await axios.post(`${BASE_URL}suppliers/register`, {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        contactNumber: formData.get('contactNumber'),
        email: formData.get('email'),
        phone: formData.get('phone'),
      },{
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });

      if (res.status === 201) {
        setSuccess(true);
        toast({
          title: "Supplier added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        e.currentTarget.reset();
      }
    } catch (e) {
      console.log(e);
      setError(e.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt="8" p="8" bg="white" boxShadow="lg" borderRadius="md">
      <Text fontSize="2xl" mb="6" fontWeight="bold" textAlign="center">
        Create New Supplier
      </Text>
      <form onSubmit={handleSupplierCreate}>
        <VStack spacing={5}>
          {Forms.SUPPLIER_CREATE.map((field, index) => (
            <FormControl key={index}>
              <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                focusBorderColor="blue.400"
                errorBorderColor="red.300"
                isRequired={field.name === 'firstName' || field.name === 'lastName'}
              />
            </FormControl>
          ))}
          <Button
            type="submit"
            bg="teal.500"
            color="white"
            width="full"
            _hover={{ bg: "teal.600" }}
            _active={{ bg: "teal.700" }}
          >
            Create Supplier
          </Button>
          {error && (
            <Alert status="error" borderRadius="md" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert status="success" borderRadius="md" mt={4}>
              <AlertIcon />
              <AlertTitle mr={2}>Success!</AlertTitle>
              <AlertDescription>Supplier has been created successfully.</AlertDescription>
            </Alert>
          )}
        </VStack>
      </form>
    </Box>
  );
};
