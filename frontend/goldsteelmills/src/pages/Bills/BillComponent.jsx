import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  HStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Heading,
  Image,
  SimpleGrid,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";
import logo from "../../../public/logo.jpeg";
import { PageHeader } from "../../components/PageHeader";

const BillComponent = () => {
  const [rows, setRows] = useState([{ id: 1 }]);
  const [advancePayment, setAdvancePayment] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const toast = useToast();
  const componentRef = useRef();

  const calculateBill = () => { // for calculating the bill
    let total = 0;
    rows.forEach((row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      total += quantity * price;
    });
    total -= advancePayment;
    const subtotal = total + previousBalance;

    return { total: total.toFixed(2), subtotal: subtotal.toFixed(2) };
  };

  const addRow = () => { // for adding the rows vehicle
    setRows([...rows, { id: rows.length + 1 }]);
  };

  const updateRow = (index, field, value) => { //updating the rows
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const { total, subtotal } = calculateBill();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, //to makesure to print the bill area of component
  });

  return (
    <>
    <PageHeader title={"Sales Bill"}/>
    <Box
      bg="#f4f4f4"
      minH="100vh"
      p={4}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        ref={componentRef}
        bg="white"
        p={8}
        rounded="lg"
        shadow="lg"
        width="100%"
        maxW="1000px"
      >
        <HStack justifyContent="space-between" mb={8}>
          <Image src={logo} alt="Factory Logo" boxSize="80px" />
          <VStack align="flex-start">
            <Heading as="h1" size="lg" color="gray.700">
              White Gold Steel Industry
            </Heading>
            <Text color="gray.500">Glotian Mor, Daska</Text>
          </VStack>
        </HStack>
        <SimpleGrid columns={[1, 2]} spacing={5} mb={8}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type="text" placeholder="Enter Name" />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type="date" />
          </FormControl>
        </SimpleGrid>
        <Table variant="simple" colorScheme="teal" mb={8}>
          <Thead bg="teal.600">
            <Tr>
              <Th color="white">#</Th>
              <Th color="white">Bill Number</Th>
              <Th color="white">Gate Pass Number</Th>
              <Th color="white">Vehicle Number</Th>
              <Th color="white">Item Type</Th>
              <Th color="white">Weight/Quantity</Th>
              <Th color="white">Rate/Price</Th>
              <Th color="white">Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row, index) => (
              <Tr key={row.id}>
                <Td>{row.id}</Td>
                <Td>
                  <Tooltip label="Bill Number">
                    <Input
                      type="text"
                      placeholder="Bill Number"
                      value={row.billNumber || ""}
                      onChange={(e) =>
                        updateRow(index, "billNumber", e.target.value)
                      }
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label="Gate Pass Number">
                    <Input
                      type="text"
                      placeholder="Gate Pass Number"
                      value={row.gatePassNumber || ""}
                      onChange={(e) =>
                        updateRow(index, "gatePassNumber", e.target.value)
                      }
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label="Vehicle Number">
                    <Input
                      type="text"
                      placeholder="Vehicle Number"
                      value={row.vehicleNumber || ""}
                      onChange={(e) =>
                        updateRow(index, "vehicleNumber", e.target.value)
                      }
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label="Item Type">
                    <Input
                      type="text"
                      placeholder="Item Type"
                      value={row.itemType || ""}
                      onChange={(e) =>
                        updateRow(index, "itemType", e.target.value)
                      }
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label="Quantity">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={row.quantity || ""}
                      onChange={(e) =>
                        updateRow(index, "quantity", e.target.value)
                      }
                    />
                  </Tooltip>
                </Td>
                <Td>
                  <Tooltip label="Price">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={row.price || ""}
                      onChange={(e) => updateRow(index, "price", e.target.value)}
                    />
                  </Tooltip>
                </Td>
                <Td>{((row.quantity || 0) * (row.price || 0)).toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={addRow}>
          Add Vehicle
        </Button>
        <SimpleGrid columns={[1, 2]} spacing={5} mt={8} mb={8}>
          <FormControl>
            <FormLabel>Advance Payment</FormLabel>
            <Input
              type="number"
              value={advancePayment}
              onChange={(e) =>
                setAdvancePayment(parseFloat(e.target.value) || 0)
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Previous Balance</FormLabel>
            <Input
              type="number"
              value={previousBalance}
              onChange={(e) =>
                setPreviousBalance(parseFloat(e.target.value) || 0)
              }
            />
          </FormControl>
        </SimpleGrid>
        <Box fontSize="xl" fontWeight="bold" color="teal.700" mb={8}>
          <Flex justifyContent="space-between">
            <Text>Total: {total}</Text>
            <Tooltip label="Subtotal includes previous balance">
              <Flex align="center">
                <Text mr={1}>Subtotal: {subtotal}</Text>
                <InfoOutlineIcon />
              </Flex>
            </Tooltip>
          </Flex>
        </Box>
        <HStack justifyContent="space-between" mt={10}>
          <Box textAlign="center" w="45%">
            <Divider />
            <Text mt={2}>Signature of CEO</Text>
          </Box>
          <Box textAlign="center" w="45%">
            <Divider />
            <Text mt={2}>Receiver</Text>
          </Box>
        </HStack>
        <Button mt={5} colorScheme="teal" onClick={handlePrint}>
          Print/Save
        </Button>
      </Box>
    </Box>
    </>
  );
};

export default BillComponent;
