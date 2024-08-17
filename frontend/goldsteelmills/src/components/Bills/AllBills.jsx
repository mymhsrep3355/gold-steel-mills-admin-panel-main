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
  Divider,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import {
  FaTruck,
  FaCalendarAlt,
  FaWeight,
  FaMoneyBillWave,
  FaClipboardList,
  FaHashtag,
} from "react-icons/fa";

const AllBills = ({ bills, handleEditBill, handleDeleteBill }) => {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={8} p={4}>
      {bills.map((bill) => (
        <Card
          key={bill._id}
          shadow="md"
          borderWidth="1px"
          borderColor="gray.200"
          rounded="xl"
          transition="transform 0.3s ease"
          _hover={{ transform: "scale(1.02)" }}
          bg="white"
        >
          <CardBody>
            <Flex alignItems="center" mb={4}>
              <Box
                flexShrink={0}
                bg="teal.500"
                p={3}
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaClipboardList} color="white" boxSize={7} />
              </Box>
              <Box ml={4}>
                <Heading size="md" color="teal.700" mb={1}>
                  {bill.itemType.name}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Bill No: {bill.bill_no}
                </Text>
              </Box>
            </Flex>

            <Divider my={4} />

            <Box>
              <Flex alignItems="center" mb={3}>
                <Icon as={FaHashtag} color="teal.500" boxSize={5} mr={2} />
                <Text fontSize="sm" color="gray.600">
                  Gate Pass No: {bill.gatePassNo}
                </Text>
              </Flex>
              <Flex alignItems="center" mb={3}>
                <Icon as={FaTruck} color="teal.500" boxSize={5} mr={2} />
                <Text fontSize="sm" color="gray.600">
                  Vehicle No: {bill.vehicle_no}
                </Text>
              </Flex>
              <Flex alignItems="center" mb={3}>
                <Icon as={FaCalendarAlt} color="teal.500" boxSize={5} mr={2} />
                <Text fontSize="sm" color="gray.600">
                  Date: {new Date(bill.date).toLocaleDateString()}
                </Text>
              </Flex>
              <Flex alignItems="center" mb={3}>
                <Icon as={FaWeight} color="teal.500" boxSize={5} mr={2} />
                <Text fontSize="sm" color="gray.600">
                  Weight: {bill.weight} kg
                </Text>
              </Flex>
              <Flex alignItems="center" mb={3}>
                <Icon as={FaClipboardList} color="teal.500" boxSize={5} mr={2} />
                <Text fontSize="sm" color="gray.600">
                  Quantity: {bill.quantity}
                </Text>
              </Flex>
              <Flex alignItems="center" mb={3}>
                <Icon as={FaMoneyBillWave} color="teal.500" boxSize={5} mr={2} />
                <Text fontSize="sm" color="gray.600">
                  Rate: {bill.rate} per kg
                </Text>
              </Flex>
            </Box>

            <Divider my={4} />

            <Flex alignItems="center" justifyContent="space-between">
              <Text fontSize="lg" fontWeight="bold" color="teal.700">
                Total: ${bill.total.toFixed(2)}
              </Text>
            </Flex>
          </CardBody>
          <CardFooter bg="gray.50" roundedBottom="xl">
            <Flex justifyContent="space-between" width="100%">
              <Button
                leftIcon={<EditIcon />}
                colorScheme="teal"
                variant="solid"
                onClick={() => handleEditBill(bill)}
                flexGrow={1}
                mr={2}
              >
                Edit
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                variant="solid"
                onClick={() => handleDeleteBill(bill._id)}
                flexGrow={1}
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
