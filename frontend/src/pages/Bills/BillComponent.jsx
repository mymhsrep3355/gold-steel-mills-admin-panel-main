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
import EditBillModal from "../../components/Bills/EditBillModal";
import EditItemModal from "../../components/Bills/EditItemModal";

const BillComponent = () => {
  const [items, setItems] = useState([]);
  const [bills, setBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
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

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`${BASE_URL}items/delete/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(items.filter((item) => item._id !== itemId));
      toast({
        title: "Item deleted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Failed to delete item.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setEditModalOpen(true);
  };

  const handleUpdateBill = async (billId, updatedBill) => {
    try {
      await axios.put(`${BASE_URL}bills/update/${billId}`, updatedBill, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Bill updated successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchBills();
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating bill:", error);
      toast({
        title: "Failed to update bill.",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteBill = async (billId) => {
    try {
      await axios.delete(`${BASE_URL}bills/delete/${billId}`, {
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
            <AllBills
              bills={bills}
              handleEditBill={handleEditBill}
              handleDeleteBill={handleDeleteBill}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

      {selectedItem && (
        <EditItemModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          item={selectedItem}
          fetchItems={fetchItems}
        />
      )}

      {selectedBill && (
        <EditBillModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          bill={selectedBill}
          items={items}
          onUpdate={handleUpdateBill}
        />
      )}
    </>
  );
};

export default BillComponent;
