import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Tooltip,
  Flex,
  Text,
  useToast,
  Image,
  SimpleGrid,
  Select,
} from "@chakra-ui/react";
import { AddIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import logo from "../../../public/logo.jpeg";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const ViewSalesBills = () => {
  const [rows, setRows] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [advancePayment, setAdvancePayment] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const componentRef = useRef();
  const toast = useToast();
  const { token } = useAuthProvider();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}suppliers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();

    fetchSuppliers();
  }, [token]);

  const handleSupplier = async (event) => {
    const supplier_id = event.target.value;
    setSelectedSupplier(supplier_id);

    // Check if both dates are provided
    if (!startDate || !endDate) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}sales/supplier`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          supplier: supplier_id,
          startDate,
          endDate,
        },
      });

      const salesData = response.data;

      // Filter the data for the selected supplier
      const matchingSales = salesData.filter(
        (sale) => sale.supplier && sale.supplier._id === supplier_id
      );

      if (matchingSales.length > 0) {
        const lastSale = matchingSales[matchingSales.length - 1];
        // setAdvancePayment(lastSale.supplier?.advance || 0);
        // setPreviousBalance(lastSale.supplier?.balance || 0);

        setAdvancePayment(0);
        setPreviousBalance(0);
        

        const filledRows = lastSale.bills.map((bill, index) => ({
          id: index + 1,
          billNumber: bill.bill_no,
          gatePassNumber: bill.gatePassNo,
          vehicleNumber: bill.vehicle_no,
          quantity: bill.quantity,
          price: bill.rate,
        }));

        setRows(filledRows);
      } else {
        setRows([{ id: 1 }]);
        setAdvancePayment(0);
        setPreviousBalance(0);
      }
    } catch (error) {
      console.error("Error fetching supplier sales data:", error);

      toast({
        title: "Failed to fetch supplier data.",
        description: "Unable to fetch data for the selected supplier.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1 }]);
  };

  const updateRow = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const calculateBill = () => {
    let total = 0;
    rows.forEach((row) => {
      const quantity = parseFloat(row.quantity) || 0;
      const price = parseFloat(row.price) || 0;
      total += quantity * price;
    });

    const subtotal = total + previousBalance - advancePayment;

    return { total: total.toFixed(2), subtotal: subtotal.toFixed(2) };
  };

  const { total, subtotal } = calculateBill();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: () =>
      `@media print { @page { size: A4 landscape; margin: 1mm } }`,
  });

  return (
    <Box
      bg="#f4f4f4"
      minH="100vh"
      width="100%"
      display="flex"
      justifyContent="center"
    >
      <Box
        ref={componentRef}
        bg="white"
        p={8}
        rounded="lg"
        shadow="lg"
        width="100%"
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
        <SimpleGrid columns={[1, 3]} spacing={5} mb={8}>
          {/* <FormControl>
            <FormLabel>Customer Name</FormLabel>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </FormControl> */}
          <FormControl>
            <FormLabel>Customer</FormLabel>
            <Select placeholder="Select Customer" onChange={handleSupplier}>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.firstName}
                </option>
              ))}
            </Select>
          </FormControl>
          {/* Date filter fields */}
          <FormControl>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
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
                    <Select
                      value={row.itemType || ""}
                      onChange={(e) =>
                        updateRow(index, "itemType", e.target.value)
                      }
                    >
                      {items.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
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
                      onChange={(e) =>
                        updateRow(index, "price", e.target.value)
                      }
                    />
                  </Tooltip>
                </Td>
                <Td>
                  {((row.quantity || 0) * (row.price || 0)).toFixed(2)}
                </Td>
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
            <Tooltip label="Subtotal includes previous balance and deducts advance payment">
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
  );
};

export default ViewSalesBills;
