import React from "react";
import {
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Button,
  Heading,
  Text,
  Flex,
  Box,
  Icon,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaTruck, FaCalendarAlt, FaWeight, FaMoneyBillWave, FaClipboardList, FaHashtag } from "react-icons/fa";

const AllBills = ({ bills, handleEditBill, handleDeleteBill }) => {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
      {bills.map((bill) => (
        <Card key={bill._id} shadow="lg" borderWidth="1px" borderColor="gray.200" rounded="lg">
          <CardBody>
            <Flex alignItems="center" mb={4}>
              <Box flexShrink={0} bg="teal.500" p={2} rounded="md">
                <Icon as={FaClipboardList} color="white" boxSize={6} />
              </Box>
              <Box ml={4}>
                <Heading size="md" color="teal.600">
                  {bill.itemType.name}
                </Heading>
                <Text color="gray.500" fontWeight="semibold">
                  Bill No: {bill.bill_no}
                </Text>
              </Box>
            </Flex>

            <Flex alignItems="center" mb={2}>
              <Icon as={FaHashtag} color="teal.500" boxSize={5} mr={2} />
              <Text>Gate Pass No: {bill.gatePassNo}</Text>
            </Flex>
            <Flex alignItems="center" mb={2}>
              <Icon as={FaTruck} color="teal.500" boxSize={5} mr={2} />
              <Text>Vehicle No: {bill.vehicle_no}</Text>
            </Flex>
            <Flex alignItems="center" mb={2}>
              <Icon as={FaCalendarAlt} color="teal.500" boxSize={5} mr={2} />
              <Text>Date: {new Date(bill.date).toLocaleDateString()}</Text>
            </Flex>
            <Flex alignItems="center" mb={2}>
              <Icon as={FaWeight} color="teal.500" boxSize={5} mr={2} />
              <Text>Weight: {bill.weight}</Text>
            </Flex>
            <Flex alignItems="center" mb={2}>
              <Icon as={FaClipboardList} color="teal.500" boxSize={5} mr={2} />
              <Text>Quantity: {bill.quantity}</Text>
            </Flex>
            <Flex alignItems="center" mb={2}>
              <Icon as={FaMoneyBillWave} color="teal.500" boxSize={5} mr={2} />
              <Text>Rate: {bill.rate}</Text>
            </Flex>

            <Flex alignItems="center" mt={4}>
              <Box flexShrink={0} bg="teal.100" p={2} rounded="md">
                <Icon as={FaMoneyBillWave} color="teal.600" boxSize={5} />
              </Box>
              <Text ml={3} fontWeight="bold" fontSize="lg" color="teal.700">
                Total: {bill.total}
              </Text>
            </Flex>
          </CardBody>
          <CardFooter>
            <Flex justifyContent="space-between" width="100%">
              <Button
                leftIcon={<EditIcon />}
                colorScheme="blue"
                variant="outline"
                onClick={() => handleEditBill(bill)}
              >
                Edit
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                variant="outline"
                onClick={() => handleDeleteBill(bill._id)}
              >
                Delete
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default AllBills;
