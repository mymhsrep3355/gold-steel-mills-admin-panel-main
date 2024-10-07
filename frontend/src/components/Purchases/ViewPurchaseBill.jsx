import React, { useState, useEffect, useRef } from "react";
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
  Tooltip,
  Flex,
  Text,
  useToast,
  Image,
  SimpleGrid,
  Select,
  Heading,
  TableContainer,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import logo from "../../../public/logo.jpeg";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const ViewPurchaseBill = () => {
  const [rows, setRows] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplierName, setSupplierName] = useState(""); // To store supplier name
  const [advancePayment, setAdvancePayment] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]); // To store item types and their names
  const [unloading, setUnloading] = useState(0);
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const [dataFetched, setDataFetched] = useState(false); // To track if data is fetched

  const componentRef = useRef();
  const toast = useToast();
  const { token } = useAuthProvider();

  const formatNumberWithCommas = (number) => {
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(number);
  };

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

    const fetchItemTypes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}itemTypes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItemTypes(response.data); // Store item types
      } catch (error) {
        console.error("Error fetching item types:", error);
      }
    };

    fetchSuppliers();
    fetchItems();
    fetchItemTypes(); // Fetch item types
  }, [token]);

  const handleSupplierChange = async (event) => {
    const selectedId = event.target.value;
    setSelectedSupplier(selectedId);

    const selectedSupplier = suppliers.find((s) => s._id === selectedId);
    if (selectedSupplier) {
      setSupplierName(`${selectedSupplier.firstName} ${selectedSupplier.lastName}`);
    }
  };

  const fetchSupplierData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}purchases/supplier`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          supplierId: selectedSupplier,
          startDate,
          endDate,
        },
      });

      const supplierData = response.data;
      const purchaseRows = supplierData?.map((bill, index) => ({
        id: index + 1,
        items: bill.bills.map((item, itemIndex) => ({
          id: itemIndex + 1,
          billNumber: item.bill_no,
          gatePassNumber: item.gatePassNo,
          vehicleNumber: item.vehicle_no,
          itemType: item.itemType, // Keep _id but map later
          quantity: item.weight,
          kaat: item.kaat,
          price: item.rate,
        })),
      }));

      setRows(purchaseRows);
      setUnloading(supplierData.unloading || 0);
      setAdvancePayment(0); // Adjust this based on supplier's actual advance payment logic
      setPreviousBalance(0); // Adjust this based on supplier's actual balance logic
      setDataFetched(true); // Set data fetched to true once the data is retrieved

    } catch (error) {
      console.error("Error fetching purchase details:", error);
      toast({
        title: "Failed to fetch purchase details.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // setDataFetched(false);
    }
  };

  const getItemTypeName = (itemTypeId) => {
    const itemType = itemTypes.find((type) => type._id === itemTypeId);
    return itemType ? itemType.name : "Unknown";
  };

  const calculateBill = () => {
    let total = 0;
    rows.forEach((row) => {
      row.items.forEach((item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        total += (quantity - (item.kaat || 0)) * price;
      });
    });
    total -= parseFloat(advancePayment);
    total -= parseFloat(unloading);
    const subtotal = total + parseFloat(previousBalance);
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
          display: none !important; /* Hide elements with 'no-print' class */
        }
      }
    `,
  });

  return (
    <Box bg="#f4f4f4" w="100%" display="flex" justifyContent="center">
      <Box
        ref={componentRef}
        bg="white"
        p={4}
        rounded="lg"
        shadow="lg"
        width="100%"
        className="print-full-width"
      >
        <HStack justifyContent="space-between" mb={4}>
          <Image src={logo} alt="Factory Logo" boxSize="80px" />
          <VStack align="flex-start">
            <Heading as="h1" size="lg" color="gray.700">
              White Gold Steel Industry
            </Heading>
            <Text color="gray.500">Glotian Mor, Daska</Text>
          </VStack>
        </HStack>

        {/* Conditionally render Supplier Name, Start Date, and End Date */}
        {dataFetched && supplierName && (
          <Box mb={4}>
            <Text fontWeight="bold">
              Supplier Name: <span style={{ fontWeight: "normal" }}>{supplierName}</span>
            </Text>
          </Box>
        )}

        {dataFetched && startDate && (
          <Box mb={4}>
            <Text fontWeight="bold">
              Start Date: <span style={{ fontWeight: "normal" }}>{startDate}</span>
            </Text>
          </Box>
        )}

        {dataFetched && endDate && (
          <Box mb={4}>
            <Text fontWeight="bold">
              End Date: <span style={{ fontWeight: "normal" }}>{endDate}</span>
            </Text>
          </Box>
        )}

        {/* Supplier Selection and Date Filters */}
        <SimpleGrid columns={[1, 3]} spacing={2} mb={4} className="no-print">
          <FormControl>
            <FormLabel>Suppliers</FormLabel>
            <Select placeholder="Select supplier" onChange={handleSupplierChange}>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.firstName + " " + supplier.lastName}
                </option>
              ))}
            </Select>
          </FormControl>

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

        <Button colorScheme="teal" onClick={fetchSupplierData} mb={4} className="no-print">
          Fetch Data
        </Button>

        {/* Table with Horizontal Scrolling */}
        <TableContainer maxWidth="100%" overflowX="auto">
          <Table variant="simple" colorScheme="teal" className="print-table">
            <Thead bg="teal.600">
              <Tr>
                <Th color="white">#</Th>
                <Th color="white">Bill Number</Th>
                <Th color="white">Gate Pass Number</Th>
                <Th color="white">Vehicle Number</Th>
                <Th color="white">Item Type</Th>
                <Th color="white">Weight/Quantity</Th>
                <Th color="white">Kaat</Th>
                <Th color="white">Rate/Price</Th>
                <Th color="white">Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {rows.map((row, rowIndex) => (
                <React.Fragment key={row.id}>
                  {row.items.map((item, itemIndex) => (
                    <Tr key={item.id}>
                      <Td>{rowIndex + 1 + "." + (itemIndex + 1)}</Td>
                      <Td>{item.billNumber || "-"}</Td>
                      <Td>{item.gatePassNumber || "-"}</Td>
                      <Td>{item.vehicleNumber || "-"}</Td>
                      <Td>{getItemTypeName(item.itemType)}</Td> {/* Use name instead of _id */}
                      <Td>{formatNumberWithCommas(item.quantity) || "-"}</Td>
                      <Td>{formatNumberWithCommas(item.kaat) || "-"}</Td>
                      <Td>{formatNumberWithCommas(item.price) || "-"}</Td>
                      <Td>
                        {formatNumberWithCommas(
                          ((item.quantity - (item.kaat || 0)) * (item.price || 0)).toFixed(2)
                        )}
                      </Td>
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Billing Information */}
        <SimpleGrid columns={[1, 3]} spacing={2} mt={4}>
          <FormControl>
            <FormLabel>Advance Payment</FormLabel>
            <Input
              type="number"
              value={advancePayment}
              onChange={(e) => setAdvancePayment(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Previous Balance</FormLabel>
            <Input
              type="number"
              value={previousBalance}
              onChange={(e) => setPreviousBalance(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Unloading</FormLabel>
            <Input
              type="number"
              value={unloading}
              onChange={(e) => setUnloading(e.target.value)}
            />
          </FormControl>
        </SimpleGrid>

        {/* Total Calculation */}
        <Box fontSize="xl" fontWeight="bold" color="teal.700" mb={4}>
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

        {/* Signatures and Print Button */}
        <HStack justifyContent="space-between" mt={4}>
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
      </Box>
    </Box>
  );
};

export default ViewPurchaseBill;
