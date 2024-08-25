import { useLocation, useNavigate } from "react-router-dom";
import { Forms } from "../../Forms.js";
import { useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Alert,
    AlertIcon,
    AlertDescription,
    VStack,
    Heading,
    IconButton,
    useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";
import { BASE_URL } from "../../utils.js";

export const SupplierEdit = () => {
    // Errors state
    const [error, setError] = useState('');

    // Access the inline data passed via navigation
    const { state } = useLocation();
    const { token } = useAuthProvider();
    const navigate = useNavigate();
    const toast = useToast();

    // console.log(state._id);
    // console.log(token);
    
    

    // Initialize state for each field
    const [formData, setFormData] = useState(() => {
        const initialData = {};
        Forms.SUPPLIER_CREATE.forEach(field => {
            initialData[field.name] = state[field.name] || '';
        });
        return initialData;
    });

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const res = await axios.put(`${BASE_URL}suppliers/update/${state._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status === 200) {
                toast({
                    title: "Supplier updated.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                navigate(-1);
            }
        } catch (e) {
            console.log(e);
            setError(e.response?.data?.error || 'An error occurred');
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

    // Handle navigation back to previous page
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Box maxW="lg" mx="auto" mt={8} p={6} bg="white" boxShadow="lg" borderRadius="md">
            <VStack spacing={6} align="stretch">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Heading size="lg">Edit Supplier</Heading>
                    <IconButton
                        aria-label="Go back"
                        icon={<ArrowBackIcon />}
                        onClick={handleBack}
                        variant="outline"
                        colorScheme="blue"
                    />
                </Box>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        {Forms.SUPPLIER_CREATE.map((field, index) => (
                            <FormControl key={index} isRequired>
                                <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formData[field.name]}
                                    onChange={handleInputChange}
                                    focusBorderColor="blue.400"
                                    errorBorderColor="red.300"
                                />
                            </FormControl>
                        ))}
                        <Button type="submit" colorScheme="blue" width="full">
                            Update
                        </Button>
                        {error && (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </VStack>
                </form>
            </VStack>
        </Box>
    );
};
