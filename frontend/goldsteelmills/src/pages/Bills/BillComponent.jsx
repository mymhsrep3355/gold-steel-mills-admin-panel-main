// import React, { useRef, useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Text,
//   VStack,
//   HStack,
//   Divider,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   useToast,
//   Heading,
//   Image,
//   SimpleGrid,
//   Flex,
//   Tooltip,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   Card,
//   CardBody,
//   CardFooter,
// } from "@chakra-ui/react";
// import { AddIcon, InfoOutlineIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
// import { useReactToPrint } from "react-to-print";
// import axios from "axios";
// import logo from "../../../public/logo.jpeg";
// import { PageHeader } from "../../components/PageHeader";
// import { BASE_URL } from "../../utils";
// import { useAuthProvider } from "../../hooks/useAuthProvider";

// const BillComponent = () => {
//   const [rows, setRows] = useState([{ id: 1 }]);
//   const [advancePayment, setAdvancePayment] = useState(0);
//   const [previousBalance, setPreviousBalance] = useState(0);
//   const [items, setItems] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newItem, setNewItem] = useState({ name: "", stock: "" });
//   const [bills, setBills] = useState([]);
//   const toast = useToast();
//   const componentRef = useRef();
//   const { token } = useAuthProvider();

//   const calculateBill = () => {
//     let total = 0;
//     rows.forEach((row) => {
//       const quantity = parseFloat(row.quantity) || 0;
//       const price = parseFloat(row.price) || 0;
//       total += quantity * price;
//     });
//     total -= advancePayment;
//     const subtotal = total + previousBalance;

//     return { total: total.toFixed(2), subtotal: subtotal.toFixed(2) };
//   };

//   const addRow = () => {
//     setRows([...rows, { id: rows.length + 1 }]);
//   };

//   const updateRow = (index, field, value) => {
//     const updatedRows = rows.map((row, i) =>
//       i === index ? { ...row, [field]: value } : row
//     );
//     setRows(updatedRows);
//   };

//   const { total, subtotal } = calculateBill();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   useEffect(() => {
//     fetchItems();
//     fetchBills();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}items`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setItems(response.data);
//     } catch (error) {
//       console.error("Error fetching items:", error);
//     }
//   };

//   const fetchBills = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}bills`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setBills(response.data);
//     } catch (error) {
//       console.error("Error fetching bills:", error);
//     }
//   };

//   const handleAddItem = async () => {
//     try {
//       await axios.post(`${BASE_URL}items/register`, newItem, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       toast({
//         title: "Item added successfully.",
//         status: "success",
//         duration: 2000,
//         isClosable: true,
//       });
//       setIsModalOpen(false);
//       fetchItems();
//     } catch (error) {
//       console.error("Error adding item:", error);
//       toast({
//         title: "Failed to add item.",
//         description: error.response?.data?.message || "Something went wrong.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   const handleEditBill = (bill) => {
//     // Implement edit functionality here
//   };

//   const handleDeleteBill = async (billId) => {
//     try {
//       await axios.delete(`${BASE_URL}bills/${billId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setBills(bills.filter((bill) => bill._id !== billId));
//       toast({
//         title: "Bill deleted successfully.",
//         status: "success",
//         duration: 2000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error("Error deleting bill:", error);
//       toast({
//         title: "Failed to delete bill.",
//         description: error.response?.data?.message || "Something went wrong.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <>
//       <PageHeader title={"Sales Bill"} />
//       <Tabs variant="enclosed">
//         <TabList>
//           <Tab>Current Bill</Tab>
//           <Tab>Add Item</Tab>
//           <Tab>All Bills</Tab>
//         </TabList>
//         <TabPanels>
//           <TabPanel>
//             <Box
//               bg="#f4f4f4"
//               minH="100vh"
//               p={4}
//               display="flex"
//               justifyContent="center"
//               alignItems="center"
//             >
//               <Box
//                 ref={componentRef}
//                 bg="white"
//                 p={8}
//                 rounded="lg"
//                 shadow="lg"
//                 width="100%"
//                 maxW="1000px"
//               >
//                 <HStack justifyContent="space-between" mb={8}>
//                   <Image src={logo} alt="Factory Logo" boxSize="80px" />
//                   <VStack align="flex-start">
//                     <Heading as="h1" size="lg" color="gray.700">
//                       White Gold Steel Industry
//                     </Heading>
//                     <Text color="gray.500">Glotian Mor, Daska</Text>
//                   </VStack>
//                 </HStack>
//                 <SimpleGrid columns={[1, 2]} spacing={5} mb={8}>
//                   <FormControl>
//                     <FormLabel>Name</FormLabel>
//                     <Input type="text" placeholder="Enter Name" />
//                   </FormControl>
//                   <FormControl>
//                     <FormLabel>Date</FormLabel>
//                     <Input type="date" />
//                   </FormControl>
//                 </SimpleGrid>
//                 <Table variant="simple" colorScheme="teal" mb={8}>
//                   <Thead bg="teal.600">
//                     <Tr>
//                       <Th color="white">#</Th>
//                       <Th color="white">Bill Number</Th>
//                       <Th color="white">Gate Pass Number</Th>
//                       <Th color="white">Vehicle Number</Th>
//                       <Th color="white">Weight/Quantity</Th>
//                       <Th color="white">Rate/Price</Th>
//                       <Th color="white">Total</Th>
//                     </Tr>
//                   </Thead>
//                   <Tbody>
//                     {rows.map((row, index) => (
//                       <Tr key={row.id}>
//                         <Td>{row.id}</Td>
//                         <Td>
//                           <Tooltip label="Bill Number">
//                             <Input
//                               type="text"
//                               placeholder="Bill Number"
//                               value={row.billNumber || ""}
//                               onChange={(e) =>
//                                 updateRow(index, "billNumber", e.target.value)
//                               }
//                             />
//                           </Tooltip>
//                         </Td>
//                         <Td>
//                           <Tooltip label="Gate Pass Number">
//                             <Input
//                               type="text"
//                               placeholder="Gate Pass Number"
//                               value={row.gatePassNumber || ""}
//                               onChange={(e) =>
//                                 updateRow(
//                                   index,
//                                   "gatePassNumber",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                           </Tooltip>
//                         </Td>
//                         <Td>
//                           <Tooltip label="Vehicle Number">
//                             <Input
//                               type="text"
//                               placeholder="Vehicle Number"
//                               value={row.vehicleNumber || ""}
//                               onChange={(e) =>
//                                 updateRow(index, "vehicleNumber", e.target.value)
//                               }
//                             />
//                           </Tooltip>
//                         </Td>
//                         <Td>
//                           <Tooltip label="Quantity">
//                             <Input
//                               type="number"
//                               placeholder="Quantity"
//                               value={row.quantity || ""}
//                               onChange={(e) =>
//                                 updateRow(index, "quantity", e.target.value)
//                               }
//                             />
//                           </Tooltip>
//                         </Td>
//                         <Td>
//                           <Tooltip label="Price">
//                             <Input
//                               type="number"
//                               placeholder="Price"
//                               value={row.price || ""}
//                               onChange={(e) =>
//                                 updateRow(index, "price", e.target.value)
//                               }
//                             />
//                           </Tooltip>
//                         </Td>
//                         <Td>
//                           {((row.quantity || 0) * (row.price || 0)).toFixed(2)}
//                         </Td>
//                       </Tr>
//                     ))}
//                   </Tbody>
//                 </Table>
//                 <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={addRow}>
//                   Add Vehicle
//                 </Button>
//                 <SimpleGrid columns={[1, 2]} spacing={5} mt={8} mb={8}>
//                   <FormControl>
//                     <FormLabel>Advance Payment</FormLabel>
//                     <Input
//                       type="number"
//                       value={advancePayment}
//                       onChange={(e) =>
//                         setAdvancePayment(parseFloat(e.target.value) || 0)
//                       }
//                     />
//                   </FormControl>
//                   <FormControl>
//                     <FormLabel>Previous Balance</FormLabel>
//                     <Input
//                       type="number"
//                       value={previousBalance}
//                       onChange={(e) =>
//                         setPreviousBalance(parseFloat(e.target.value) || 0)
//                       }
//                     />
//                   </FormControl>
//                 </SimpleGrid>
//                 <Box fontSize="xl" fontWeight="bold" color="teal.700" mb={8}>
//                   <Flex justifyContent="space-between">
//                     <Text>Total: {total}</Text>
//                     <Tooltip label="Subtotal includes previous balance">
//                       <Flex align="center">
//                         <Text mr={1}>Subtotal: {subtotal}</Text>
//                         <InfoOutlineIcon />
//                       </Flex>
//                     </Tooltip>
//                   </Flex>
//                 </Box>
//                 <HStack justifyContent="space-between" mt={10}>
//                   <Box textAlign="center" w="45%">
//                     <Divider />
//                     <Text mt={2}>Signature of CEO</Text>
//                   </Box>
//                   <Box textAlign="center" w="45%">
//                     <Divider />
//                     <Text mt={2}>Receiver</Text>
//                   </Box>
//                 </HStack>
//                 <Button mt={5} colorScheme="teal" onClick={handlePrint}>
//                   Print/Save
//                 </Button>
//               </Box>
//             </Box>
//           </TabPanel>
//           <TabPanel>
//             <Box>
//               <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
//                 Add New Item
//               </Button>
//               <Table variant="simple" colorScheme="teal" mt={4}>
//                 <Thead bg="teal.600">
//                   <Tr>
//                     <Th color="white">Item Name</Th>
//                     <Th color="white">Stock</Th>
//                   </Tr>
//                 </Thead>
//                 <Tbody>
//                   {items.map((item) => (
//                     <Tr key={item._id}>
//                       <Td>{item.name}</Td>
//                       <Td>{item.stock}</Td>
//                     </Tr>
//                   ))}
//                 </Tbody>
//               </Table>
//               <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//                 <ModalOverlay />
//                 <ModalContent>
//                   <ModalHeader>Add New Item</ModalHeader>
//                   <ModalCloseButton />
//                   <ModalBody>
//                     <FormControl>
//                       <FormLabel>Item Name</FormLabel>
//                       <Input
//                         placeholder="Enter item name"
//                         value={newItem.name}
//                         onChange={(e) =>
//                           setNewItem({ ...newItem, name: e.target.value })
//                         }
//                       />
//                     </FormControl>
//                     <FormControl mt={4}>
//                       <FormLabel>Stock</FormLabel>
//                       <Input
//                         placeholder="Enter stock quantity"
//                         type="number"
//                         value={newItem.stock}
//                         onChange={(e) =>
//                           setNewItem({ ...newItem, stock: e.target.value })
//                         }
//                       />
//                     </FormControl>
//                   </ModalBody>
//                   <ModalFooter>
//                     <Button colorScheme="teal" onClick={handleAddItem}>
//                       Save
//                     </Button>
//                     <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
//                       Cancel
//                     </Button>
//                   </ModalFooter>
//                 </ModalContent>
//               </Modal>
//             </Box>
//           </TabPanel>
//           <TabPanel>
//             <SimpleGrid columns={[1, 2, 3]} spacing={5}>
//               {bills.map((bill) => (
//                 <Card key={bill._id} shadow="md">
//                   <CardBody>
//                     <Heading size="md">{bill.itemType.name}</Heading>
//                     <Text>Bill No: {bill.bill_no}</Text>
//                     <Text>Gate Pass No: {bill.gatePassNo}</Text>
//                     <Text>Vehicle No: {bill.vehicle_no}</Text>
//                     <Text>Date: {new Date(bill.date).toLocaleDateString()}</Text>
//                     <Text>Weight: {bill.weight}</Text>
//                     <Text>Quantity: {bill.quantity}</Text>
//                     <Text>Rate: {bill.rate}</Text>
//                     <Text>Total: {bill.total}</Text>
//                   </CardBody>
//                   <CardFooter>
//                     <Button
//                       leftIcon={<EditIcon />}
//                       colorScheme="blue"
//                       mr={2}
//                       onClick={() => handleEditBill(bill)}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       leftIcon={<DeleteIcon />}
//                       colorScheme="red"
//                       onClick={() => handleDeleteBill(bill._id)}
//                     >
//                       Delete
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </SimpleGrid>
//           </TabPanel>
//         </TabPanels>
//       </Tabs>
//     </>
//   );
// };

// export default BillComponent;


import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { PageHeader } from "../../components/PageHeader";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

import Bill from "../../components/Bills/Bill";
import AddItemModal from "../../components/Bills/AddItemModal";
import AllBills from "../../components/Bills/AllBills";

const BillComponent = () => {
  const [items, setItems] = useState([]);
  const [bills, setBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const { token } = useAuthProvider();

  useEffect(() => {
    fetchItems();
    fetchBills();
  }, []);

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

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${BASE_URL}bills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      await axios.post(`${BASE_URL}items/register`, newItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Item added successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchItems(); // Fetch updated items
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Failed to add item.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditBill = (bill) => {
    // Implement edit functionality here
  };

  const handleDeleteBill = async (billId) => {
    try {
      await axios.delete(`${BASE_URL}bills/${billId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBills(bills.filter((bill) => bill._id !== billId));
      toast({
        title: "Bill deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast({
        title: "Failed to delete bill.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <PageHeader title={"Sales Bill"} />
      <Tabs variant="solid-rounded" colorScheme="teal">
        <TabList mt={5}>
          <Tab>Sale Bill</Tab>
          <Tab>Add Item</Tab>
          <Tab>All Bills</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Bill />
          </TabPanel>
          <TabPanel>
            <Box>
              <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>
                <AddIcon mr={2} /> Add New Item
              </Button>
              <AddItemModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                handleAddItem={handleAddItem}
                fetchItems={fetchItems} // Pass the fetchItems function to the modal
              />
              <Table variant="striped" colorScheme="teal" mt={5}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Item Name</Th>
                    <Th>Stock</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.map((item, index) => (
                    <Tr key={item._id}>
                      <Td>{index + 1}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.stock}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
          <TabPanel>
            <AllBills bills={bills} handleEditBill={handleEditBill} handleDeleteBill={handleDeleteBill} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default BillComponent;
