import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  SimpleGrid,
  useToast,
  Select,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";
import { PageHeader } from "../../components/PageHeader";
import PurchaseForm from "../../components/Purchases/PurchaseForm";
import PurchaseCard from "../../components/Purchases/PurchaseCard";
import AddItemModal from "../../components/Bills/AddItemModal";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const toast = useToast();
  const { token } = useAuthProvider();

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
  }

  useEffect(() => {
    fetchSuppliers();
  },[])
  const fetchPurchases = async () => {
    
    const appendUrl = selectedSupplier ? `&supplierId=${selectedSupplier}` : ''
    console.log(appendUrl)

    if (startDate && endDate) {
      try {
        const response = await axios.get(
          `${BASE_URL}purchases?startDate=${startDate}&endDate=${endDate}` +  appendUrl,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data)
        
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        toast({
          title: "Failed to fetch purchases.",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Invalid date range.",
        description: "Please select both start and end dates.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
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
      fetchItems();
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



  

  return (
    <>
      <PageHeader title="Purchases" />
      <Tabs variant="solid-rounded" colorScheme="teal" mt={5}>
        <TabList>
          <Tab>Add Purchase</Tab>
          <Tab>Add Items </Tab>
          <Tab>View Purchases</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PurchaseForm />
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
                fetchItems={fetchItems}
              />
              <Table variant="striped" colorScheme="teal" mt={5}>
                <Thead>
                  <Tr>
                    <Th>#</Th>
                    <Th>Item Name</Th>
                    <Th>Stock</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.map((item, index) => (
                    <Tr key={item._id}>
                      <Td>{index + 1}</Td>
                      <Td>{item.name}</Td>
                      <Td>{item.stock}</Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          mr={2}
                          onClick={() => handleEditItem(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          <TabPanel>
            <SimpleGrid columns={[1, 3]} spacing={5} mb={8}>
              <Box w="100%">
                <Select
                  placeholder="Select supplier"
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.firstName + " " + supplier.lastName}
                    </option>
                  ))}
                </Select>
              </Box>
              
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button colorScheme="teal" onClick={fetchPurchases}>
                Fetch Purchases
              </Button>
            </SimpleGrid>
            <SimpleGrid columns={[1, 2, 3]} spacing={5}>
              {purchases?.map((purchase) => (
                <PurchaseCard key={purchase._id} purchase={purchase} />
              ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Purchases;
