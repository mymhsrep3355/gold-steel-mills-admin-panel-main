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
} from "@chakra-ui/react";
import { AddIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import logo from "../../../public/logo.jpeg";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

const PurchaseForm = () => {
  const [rows, setRows] = useState([{ id: 1, items: [{ id: 1 }] }]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [advancePayment, setAdvancePayment] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [items, setItems] = useState([]);
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

    fetchSuppliers();
    fetchItems();
  }, [token]);

  const handleSupplierChange = (event) => {
    const supplier_id = event.target.value;
    setSelectedSupplier(supplier_id);
    const supplier = suppliers.find((s) => s._id === supplier_id);
    if (supplier) {
      setAdvancePayment(supplier.advance || 0);
      setPreviousBalance(supplier.balance || 0);
    }
  };

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1, items: [{ id: 1 }] }]);
  };

  const addItemToRow = (rowIndex) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex
        ? {
            ...row,
            items: [...row.items, { id: row.items.length + 1 }],
          }
        : row
    );
    setRows(updatedRows);
  };

  const updateRow = (rowIndex, itemIndex, field, value) => {
    const updatedRows = rows.map((row, index) =>
      index === rowIndex
        ? {
            ...row,
            items: row.items.map((item, i) =>
              i === itemIndex ? { ...item, [field]: value } : item
            ),
          }
        : row
    );
    setRows(updatedRows);
  };

  const calculateBill = () => {
    let total = 0;
    rows.forEach((row) => {
      row.items.forEach((item) => {
        const quantity = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.price) || 0;
        total += quantity * price;
      });
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
        margin: 1mm;
      }
      @media print {
        body {
          font-size: 12pt;
          color: black;
        }
        .print-full-width {
          min-width: fit-content;
          width: auto;
        }
        .print-table th, .print-table td {
          padding: 8px;
          font-size: 10pt;
          border: 1px solid black;
        }
        .print-table th {
          background-color: #4A5568; /* Adjust for visibility */
          color: white;
        }
      }
    `
  });

  const handleSubmit = async () => {
    const billDataArray = rows.map((row) => {
      const billItems = row.items.map((item) => ({
        weight: parseFloat(item.quantity || 0),
        itemType: item.itemType || "",
        quantity: parseFloat(item.quantity || 0),
        vehicle_no: item.vehicleNumber || "",
        rate: parseFloat(item.price || 0),
        total: parseFloat((item.quantity || 0) * (item.price || 0)).toFixed(2),
        kaat: parseFloat(item.kaat || 0),
        gatePassNo: item.gatePassNumber || "",
        bill_no: item.billNumber || "",
      }));
      return billItems;
    });

    const flattenedBillDataArray = billDataArray.flat();

    const purchaseData = {
      supplier: selectedSupplier,
      bills: flattenedBillDataArray,
      totalAmount: flattenedBillDataArray.reduce(
        (acc, bill) => acc + parseFloat(bill.total || 0),
        0
      ),
    };

    try {
      await axios.post(`${BASE_URL}purchases/register`, purchaseData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Purchase registered successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      const daybookPayload = {
        supplierId: selectedSupplier,
        description: "Purchase",
        amount: purchaseData.totalAmount,
        type: "credit",
        cash_or_bank: "cash",
      };
      try {
        await axios.post(`${BASE_URL}daybook/register`, daybookPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({
          title: "Daybook updated successfully.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error updating daybook:", error);
        toast({
          title: "Failed to update daybook.",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error registering purchase:", error);
      toast({
        title: "Failed to register purchase.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg="#f4f4f4"
      w={"100%"}
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
        className="print-full-width"
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
        <SimpleGrid columns={[1, 2]} spacing={5} mb={8} className="print-full-width">
          <FormControl>
            <FormLabel>Suppliers</FormLabel>
            <Select
              placeholder="Select supplier"
              onChange={handleSupplierChange}
            >
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.firstName + " " + supplier.lastName}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>
        <Table variant="simple" colorScheme="teal" mb={8} className="print-table">
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
                    <Td>{itemIndex === 0 ? row.id : ""}</Td>
                    <Td>
                      <Tooltip label="Bill Number">
                        <Input
                          type="text"
                          placeholder="Bill Number"
                          value={item.billNumber || ""}
                          onChange={(e) =>
                            updateRow(rowIndex, itemIndex, "billNumber", e.target.value)
                          }
                          className="print-full-width"
                        />
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label="Gate Pass Number">
                        <Input
                          type="text"
                          placeholder="Gate Pass Number"
                          value={item.gatePassNumber || ""}
                          onChange={(e) =>
                            updateRow(rowIndex, itemIndex, "gatePassNumber", e.target.value)
                          }
                          className="print-full-width"
                        />
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label="Vehicle Number">
                        <Input
                          type="text"
                          placeholder="Vehicle Number"
                          value={item.vehicleNumber || ""}
                          onChange={(e) =>
                            updateRow(rowIndex, itemIndex, "vehicleNumber", e.target.value)
                          }
                          className="print-full-width"
                        />
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip label="Item Type">
                        <Select style={{ minWidth: 'fit-content', width : 'auto'}}
                          placeholder="Select item"
                          onChange={(e) =>
                            updateRow(rowIndex, itemIndex, "itemType", e.target.value)
                          }
                          className="print-full-width"
                        >
                          {items.map((itemOption) => (
                            <option key={itemOption._id} value={itemOption._id}>
                              {itemOption.name}
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
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateRow(rowIndex, itemIndex, "quantity", e.target.value)
                          }
                          className="print-full-width"
                        />
                      </Tooltip>
                    </Td>

                    <Td>
                      <Tooltip label="Kaat">
                        <Input
                          type="number"
                          placeholder="Kaat"
                          value={item.kaat || ""}
                          onChange={(e) =>
                            updateRow(rowIndex, itemIndex, "kaat", e.target.value)
                          }
                          className="print-full-width"
                        />
                      </Tooltip>
                    </Td>

                    
                    <Td>
                      <Tooltip label="Price">
                        <Input
                          type="number"
                          placeholder="Price"
                          value={item.price || ""}
                          onChange={(e) =>
                            updateRow(rowIndex, itemIndex, "price", e.target.value)
                          }
                          className="print-full-width"
                        />
                      </Tooltip>
                    </Td>
                    <Td>{((item.quantity - item.kaat) * (item.price || 0)).toFixed(2)}</Td>
                  </Tr>
                ))}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={addRow}>
          Add Bill
        </Button>
        <SimpleGrid columns={[1, 2]} spacing={5} mt={8} mb={8} className="print-full-width">
          <FormControl>
            <FormLabel>Advance Payment</FormLabel>
            <Input
              type="number"
              value={advancePayment}
              onChange={(e) =>
                setAdvancePayment(parseFloat(e.target.value) || 0)
              }
              className="print-full-width"
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
              className="print-full-width"
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
        <Button mt={5} ml={3} colorScheme="teal" onClick={handleSubmit}>
          Register Purchase
        </Button>
      </Box>
    </Box>
  );
};

export default PurchaseForm;
