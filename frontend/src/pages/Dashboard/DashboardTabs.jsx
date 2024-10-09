import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Container,
  Divider,
} from "@chakra-ui/react";

import Dashboard from "./Dashboard";
import { PageHeader } from "../../components/PageHeader";
import FinancialBook from "../../components/Dashboard/FinancialBook";
import Results from "../../components/Dashboard/Results";



const DashboardTabs = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Container maxW={"auto"} p={8} mt={4} bg={bgColor} rounded="lg" shadow="lg">
      <PageHeader title="Dashboard" />

      <Divider my={6} borderColor="gray.300" />

      <Tabs variant="soft-rounded" colorScheme="teal">
        <TabList mb={4}>
          <Tab>Analytics</Tab>
          <Tab>Financial Book</Tab>
          <Tab>Results</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Dashboard />
          </TabPanel>
          <TabPanel>
            <FinancialBook />
          </TabPanel>
          <TabPanel>
            <Results />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default DashboardTabs;
