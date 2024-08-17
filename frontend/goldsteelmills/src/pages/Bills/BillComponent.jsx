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
      console.log(response.data);
      
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

  const handleEditBill = (bill) => {
  
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
                fetchItems={fetchItems}
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
