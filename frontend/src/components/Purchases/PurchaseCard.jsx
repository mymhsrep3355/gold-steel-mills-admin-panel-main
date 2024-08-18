import React, { useState } from "react";
import {
  Box,
  Text,
  Badge,
  VStack,
  HStack,
  IconButton,
  Flex,
  useToast,
  Divider,
  Stack,
  Avatar,
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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaTruck, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { GiWeight } from "react-icons/gi";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const PurchaseCard = ({ purchase, fetchPurchases }) => {
  const { token } = useAuthProvider();
  const toast = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updatedPurchase, setUpdatedPurchase] = useState({
    totalAmount: purchase.totalAmount,
    date: new Date(purchase.date).toISOString().split("T")[0],
    bills: purchase.bills.map(bill => ({
      _id: bill._id,
      vehicle_no: bill.vehicle_no,
      quantity: bill.quantity,
      rate: bill.rate,
      total: bill.total,
      itemType: bill.itemType,
    })),
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}purchases/delete/${purchase._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Purchase deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchPurchases();
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast({
        title: "Failed to delete purchase.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = () => {
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const { totalAmount, date, bills } = updatedPurchase;

      const formattedBills = bills.map(bill => ({
        _id: bill._id, 
        vehicle_no: bill.vehicle_no,
        quantity: bill.quantity,
        rate: bill.rate,
        total: bill.quantity * bill.rate,
        itemType: bill.itemType,
      }));

      console.log(bills);
      
      

      const payload = {
        totalAmount: formattedBills.reduce((sum, bill) => sum + bill.total, 0),
        date,
        bills: formattedBills,
      };

      await axios.put(`${BASE_URL}purchases/update/${purchase._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Purchase updated successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setIsEditOpen(false);
      fetchPurchases();
    } catch (error) {
      console.error("Error updating purchase:", error);
      toast({
        title: "Failed to update purchase.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        p={6}
        shadow="lg"
        borderWidth="1px"
        borderRadius="lg"
        bgGradient="linear(to-r, blue.400, teal.400)"
        color="white"
        mb={6}
      >
        <VStack align="stretch" spacing={4}>
          <HStack justifyContent="space-between">
            <Flex alignItems="center">
              <Avatar name={`${purchase.supplier.firstName} ${purchase.supplier.lastName}`} size="sm" />
              <Text fontWeight="bold" fontSize="lg" ml={3}>
                {purchase.supplier.firstName} {purchase.supplier.lastName}
              </Text>
            </Flex>
            <HStack spacing={3}>
              <IconButton
                aria-label="Edit Purchase"
                icon={<EditIcon />}
                size="sm"
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={handleEdit}
              />
              <IconButton
                aria-label="Delete Purchase"
                icon={<DeleteIcon />}
                size="sm"
                variant="outline"
                colorScheme="red"
                onClick={handleDelete}
              />
            </HStack>
          </HStack>

          <Divider borderColor="whiteAlpha.500" />

          <HStack justifyContent="space-between">
            <Flex alignItems="center">
              <FaCalendarAlt />
              <Text ml={2}>{new Date(purchase.date).toLocaleDateString()}</Text>
            </Flex>
            <Badge colorScheme="green" fontSize="md">
              Total: ${purchase.totalAmount}
            </Badge>
          </HStack>

          {purchase.bills.map((bill) => (
            <Box
              key={bill._id}
              p={4}
              bg="whiteAlpha.300"
              borderRadius="md"
              mb={3}
              borderColor="whiteAlpha.500"
            >
              <Flex justifyContent="space-between" alignItems="center">
                <Stack spacing={1}>
                  <Text>
                    <FaTruck /> <strong>Vehicle:</strong> {bill.vehicle_no}
                  </Text>
                  <Text>
                    <GiWeight /> <strong>Quantity:</strong> {bill.quantity}
                  </Text>
                </Stack>
                <Badge colorScheme="yellow" fontSize="sm">
                  ${bill.total}
                </Badge>
              </Flex>
              <Flex justifyContent="space-between" mt={2}>
                <Text>
                  <strong>Item:</strong> {bill.itemType}
                </Text>
                <Text>
                  <FaDollarSign /> ${bill.rate}/unit
                </Text>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Edit Purchase Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Purchase</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={updatedPurchase.date}
                onChange={(e) => setUpdatedPurchase({ ...updatedPurchase, date: e.target.value })}
              />
            </FormControl>
            {updatedPurchase.bills.map((bill, index) => (
              <Box key={index} mb={4}>
                <FormControl mb={2}>
                  <FormLabel>Vehicle Number</FormLabel>
                  <Input
                    value={bill.vehicle_no}
                    onChange={(e) => {
                      const newBills = [...updatedPurchase.bills];
                      newBills[index].vehicle_no = e.target.value;
                      setUpdatedPurchase({ ...updatedPurchase, bills: newBills });
                    }}
                  />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    value={bill.quantity}
                    onChange={(e) => {
                      const newBills = [...updatedPurchase.bills];
                      newBills[index].quantity = e.target.value;
                      newBills[index].total = e.target.value * newBills[index].rate;
                      setUpdatedPurchase({ ...updatedPurchase, bills: newBills });
                    }}
                  />
                </FormControl>
                <FormControl mb={2}>
                  <FormLabel>Rate</FormLabel>
                  <Input
                    type="number"
                    value={bill.rate}
                    onChange={(e) => {
                      const newBills = [...updatedPurchase.bills];
                      newBills[index].rate = e.target.value;
                      newBills[index].total = e.target.value * newBills[index].quantity;
                      setUpdatedPurchase({ ...updatedPurchase, bills: newBills });
                    }}
                  />
                </FormControl>
              </Box>
            ))}
            <FormControl>
              <FormLabel>Total Amount</FormLabel>
              <Input
                type="number"
                value={updatedPurchase.totalAmount}
                isReadOnly
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PurchaseCard;
