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
  TableContainer,
} from "@chakra-ui/react";
import { AddIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import logo from "../../../public/logo.jpeg";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const Bill = () => {
  const [rows, setRows] = useState([{ id: 1 }]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [advancePayment, setAdvancePayment] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
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

    fetchSuppliers();
    fetchItems();
  }, [token]);

  const handleSupplier = (event) => {
    const supplier_id = event.target.value;
    setSelectedSupplier(supplier_id);
    const supplier = suppliers.find((supplier) => supplier._id === supplier_id);
    if (supplier) {
      setAdvancePayment(0);
      setPreviousBalance(0);
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

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1 }]);
  };

  const formatNumberWithCommas = (number) => {
    if (!number) return "";
    try {
    return new Intl.NumberFormat("en-US").format(number);
    }
    catch (error) {
      console.error("Error formatting number:", error);
      return number;
    }
  };

  const removeCommas = (value) => (value ? value.replace(/,/g, "") : ""); // Check if value exists before calling replace


  const handleInputChange = (index, field, value) => {

    let finalVal;

    if (field === "quantity" || field === "price") {
      const cleanValue = removeCommas(value); // Remove commas before storing the value
      const formattedValue = formatNumberWithCommas(cleanValue); // Format the number with commas

      finalVal = formattedValue;
    }
    else{
      finalVal = value;
    }
    
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: finalVal } : row
    );
    setRows(updatedRows);
  };

  const calculateBill = () => {
    let total = 0;
    rows.forEach((row) => {
      const quantity = parseFloat(removeCommas(row.quantity)) || 0;
      const price = parseFloat(removeCommas(row.price)) || 0;
      total += quantity * price;
    });
    total -= advancePayment;
    const subtotal = total + previousBalance;
    return { total: total.toFixed(2), subtotal: subtotal.toFixed(2) };
  };

  const { total, subtotal } = calculateBill();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      @media print {
        body {
          font-size: 12pt;
          color: black;
        }
        .print-full-width {
          width: auto;
        }
        .print-table th, .print-table td {
          padding: 8px;
          font-size: 10pt;
          border: 1px solid black;
        }
        .print-table th {
          background-color: #4A5568;
          color: white;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

  const handleSubmit = async () => {
    const billDataArray = rows.map((row) => ({
      supplier: selectedSupplier || "",
      customerName: customerName || "",
      weight: parseFloat(removeCommas(row.quantity)) || 0,
      itemType: row.itemType || "",
      quantity: parseFloat(removeCommas(row.quantity)) || 0,
      vehicle_no: row.vehicleNumber || "",
      rate: parseFloat(removeCommas(row.price)) || 0,
      total: parseFloat((removeCommas(row.quantity) || 0) * (removeCommas(row.price) || 0)).toFixed(2),
      gatePassNo: row.gatePassNumber || "",
      bill_no: row.billNumber || "",
      date: new Date().toISOString().split("T")[0],
    }));

    const salesData = {
      supplier: selectedSupplier,
      bills: billDataArray,
      totalAmount: billDataArray.reduce(
        (acc, bill) => acc + parseFloat(bill.total || 0),
        0
      ),
    };

    try {
      await axios.post(`${BASE_URL}sales/register`, salesData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Sales registered successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      handlePrint();
    } catch (error) {
      console.error("Error registering sales:", error);
      toast({
        title: "Failed to register sales.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="#f4f4f4" minH="100vh" width="100%" display="flex" justifyContent="center">
      <Box ref={componentRef} bg="white" p={8} rounded="lg" shadow="lg" width="100%">
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
          <FormControl>
            <FormLabel>Customer</FormLabel>
            <Select placeholder="Select Customer" onChange={(e) => handleSupplier(e)}>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.firstName}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <TableContainer overflowX="auto">
          <Table variant="simple" colorScheme="teal" mb={8} className="print-table">
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
                        onChange={(e) => handleInputChange(index, "billNumber", e.target.value)}
                        style={{ minWidth: "150px", width: "150px" }}
                      />
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label="Gate Pass Number">
                      <Input
                        type="text"
                        placeholder="Gate Pass Number"
                        value={row.gatePassNumber || ""}
                        onChange={(e) => handleInputChange(index, "gatePassNumber", e.target.value)}
                        style={{ minWidth: "150px", width: "150px" }}
                      />
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label="Vehicle Number">
                      <Input
                        type="text"
                        placeholder="Vehicle Number"
                        value={row.vehicleNumber || ""}
                        onChange={(e) => handleInputChange(index, "vehicleNumber", e.target.value)}
                        style={{ minWidth: "150px", width: "150px" }}
                      />
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label="Item Type">
                      <Select
                        placeholder="Select item"
                        onChange={(e) => handleInputChange(index, "itemType", e.target.value)}
                        style={{ minWidth: "150px", width: "150px" }}
                      >
                        {items.map((itemType) => (
                          <option key={itemType._id} value={itemType._id}>
                            {itemType.name}
                          </option>
                        ))}
                      </Select>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label="Quantity">
                      <Input
                        type="text" // Text type to handle comma-formatted input
                        placeholder="Quantity"
                        value={row.quantity || ""}
                        onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                        style={{ minWidth: "150px", width: "150px" }}
                      />
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip label="Price">
                      <Input
                        type="text" // Text type to handle comma-formatted input
                        placeholder="Price"
                        value={row.price || ""}
                        onChange={(e) => handleInputChange(index, "price", e.target.value)}
                        style={{ minWidth: "150px", width: "150px" }}
                      />
                    </Tooltip>
                  </Td>
                  <Td>{formatNumberWithCommas(((removeCommas(row.quantity) || 0) * (removeCommas(row.price) || 0)).toFixed(2))}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={addRow}>
          Add Vehicle
        </Button>

        <SimpleGrid columns={[1, 2]} spacing={5} mt={8} mb={8}>
          <FormControl>
            <FormLabel>Advance Payment</FormLabel>
            <Input
              type="number"
              value={advancePayment}
              onChange={(e) => setAdvancePayment(parseFloat(e.target.value) || 0)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Previous Balance</FormLabel>
            <Input
              type="number"
              value={previousBalance}
              onChange={(e) => setPreviousBalance(parseFloat(e.target.value) || 0)}
            />
          </FormControl>
        </SimpleGrid>

        <Box fontSize="xl" fontWeight="bold" color="teal.700" mb={8}>
          <Flex justifyContent="space-between">
            <Text>Total: {formatNumberWithCommas(total)}</Text>
            <Tooltip label="Subtotal includes previous balance">
              <Flex align="center">
                <Text mr={1}>Subtotal: {formatNumberWithCommas(subtotal)}</Text>
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

        <Button mt={5} colorScheme="teal" onClick={handlePrint} className="no-print">
          Print/Save
        </Button>
        <Button mt={5} ml={3} colorScheme="teal" onClick={handleSubmit}>
          Register Bill
        </Button>
      </Box>
    </Box>
  );
};

export default Bill;
