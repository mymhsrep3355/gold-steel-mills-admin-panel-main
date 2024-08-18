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
} from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";
import { PageHeader } from "../../components/PageHeader";
import PurchaseForm from "../../components/Purchases/PurchaseForm";
import PurchaseCard from "../../components/Purchases/PurchaseCard";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const toast = useToast();
  const { token } = useAuthProvider();

  const fetchPurchases = async () => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(
          `${BASE_URL}purchases?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  return (
    <>
      <PageHeader title="Purchases" />
      <Tabs variant="solid-rounded" colorScheme="teal" mt={5}>
        <TabList>
          <Tab>Add Purchase</Tab>
          <Tab>View Purchases</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PurchaseForm />
          </TabPanel>
          <TabPanel>
            <SimpleGrid columns={[1, 2]} spacing={5} mb={8}>
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
              {purchases.map((purchase) => (
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
