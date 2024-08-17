import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
  VStack,
  Image,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { PageHeader } from "../../components/PageHeader";
import logo from "../../../public/logo.jpeg";

const BillForm = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [unloading, setUnloading] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const toast = useToast();

  const calculateBill = () => {
    let totalValue = 0;

    rows.forEach((row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const kaat = parseFloat(row.kaat) || 0;
      const price = parseFloat(row.price) || 0;
      const effectiveQuantity = quantity - kaat;
      const itemTotal = price * effectiveQuantity;

      totalValue += itemTotal;
    });

    const subtotalValue = totalValue - unloading + previousBalance;

    setTotal(totalValue.toFixed(2));
    setSubtotal(subtotalValue.toFixed(2));
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        gatePassNumber: "",
        vehicleNumber: "",
        itemType: "",
        quantity: 0,
        kaat: 0,
        price: 0,
      },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
    calculateBill();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Bill submitted.",
      description: "Your bill has been created successfully.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <PageHeader title="Supplies Loading" />
      <Box
        bg="white"
        p={5}
        rounded="md"
        shadow="md"
        maxW="1000px"
        mx="auto"
        mt={8}
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
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="date">Date</FormLabel>
              <Input type="date" id="date" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="gatePassNumber">Gate Pass Number</FormLabel>
              <Input type="text" id="gatePassNumber" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input type="text" id="name" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="unloading">
                Unloading (deducted from Total)
              </FormLabel>
              <Input
                type="number"
                id="unloading"
                step="any"
                value={unloading}
                onChange={(e) => {
                  setUnloading(parseFloat(e.target.value));
                  calculateBill();
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="previousBalance">Previous Balance</FormLabel>
              <Input
                type="number"
                id="previousBalance"
                step="any"
                value={previousBalance}
                onChange={(e) => {
                  setPreviousBalance(parseFloat(e.target.value));
                  calculateBill();
                }}
              />
            </FormControl>
          </VStack>

          <HStack
            mt={6}
            justify="space-between"
            fontWeight="bold"
            fontSize="lg"
            color="teal.600"
          >
            <Text>Total: {total}</Text>
            <Text>Subtotal: {subtotal}</Text>
          </HStack>

          <Table variant="simple" mt={6}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Gate Pass Number</Th>
                <Th>Vehicle Number</Th>
                <Th>Item Type</Th>
                <Th>Weight/Quantity</Th>
                <Th>KAAT</Th>
                <Th>Rate/Price</Th>
                <Th>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>
                    <Input
                      type="text"
                      value={row.gatePassNumber}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "gatePassNumber",
                          e.target.value
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="text"
                      value={row.vehicleNumber}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "vehicleNumber",
                          e.target.value
                        )
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="text"
                      value={row.itemType}
                      onChange={(e) =>
                        handleInputChange(index, "itemType", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      step="any"
                      value={row.quantity}
                      onChange={(e) =>
                        handleInputChange(index, "quantity", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      step="any"
                      value={row.kaat}
                      onChange={(e) =>
                        handleInputChange(index, "kaat", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      step="any"
                      value={row.price}
                      onChange={(e) =>
                        handleInputChange(index, "price", e.target.value)
                      }
                    />
                  </Td>
                  <Td>
                    {((parseFloat(row.quantity) || 0) -
                      (parseFloat(row.kaat) || 0)) *
                      (parseFloat(row.price) || 0).toFixed(2)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Button colorScheme="teal" mt={4} width="full" onClick={handleAddRow}>
            Add Vehicle
          </Button>

          <Box mt={6} display="flex" justifyContent="space-between">
            <Box textAlign="center">
              <Text>Signature of CEO</Text>
              <Box
                mt={2}
                borderBottom="2px solid #ddd"
                width="100px"
                mx="auto"
              ></Box>
            </Box>
            <Box textAlign="center">
              <Text>Receiver</Text>
              <Box
                mt={2}
                borderBottom="2px solid #ddd"
                width="100px"
                mx="auto"
              ></Box>
            </Box>
          </Box>

          <Button colorScheme="teal" mt={6} width="full" onClick={handlePrint}>
            Print/Save
          </Button>
        </form>
      </Box>
    </>
  );
};

export default BillForm;
