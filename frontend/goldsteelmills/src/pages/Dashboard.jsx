import React from "react";
import { Box, SimpleGrid, VStack, Heading, Flex } from "@chakra-ui/react";
import { PageHeader } from "../components/PageHeader";
import PieChartDemo from "../components/Dashboard/PieChart";
import HorizontalBarDemo from "../components/Dashboard/HorizontalBar";
import InfoCard from "../components/Dashboard/InfoCards";
import LineDemo from "../components/Dashboard/LineChart";


export const Dashboard = () => {
  return (
    <Box p={3}>
      <PageHeader title="Dashboard" />
      
      <SimpleGrid columns={[1, null, 3]} spacing={10} mt={5}>
        <InfoCard title="Total Revenue" totalNumber="PKR 130M" bgColor="#FF6F61" />

        <InfoCard title="Total Steel Sold" totalNumber="1500 Tons" bgColor="#FF6F61" />
        <InfoCard title="Supplies Available" totalNumber="6000 Tons" bgColor="#FF6F61" />
      </SimpleGrid>

      <Heading as="h2" size="lg" mt={10} mb={6} textAlign="center">
        Analytics
      </Heading>

      {/* <VStack spacing={10} mt={10} align="stretch"> */}
      <SimpleGrid columns={[1, null, 2]} spacing={10} mt={5}>
        <Box p={5} boxShadow="lg" borderRadius="md" bg="white">
          <PieChartDemo />
        </Box>

        <Box p={5} boxShadow="lg" borderRadius="md" bg="white">
          <HorizontalBarDemo />
        </Box>
        <Box p={5} boxShadow="lg" borderRadius="md" bg="white">
          <LineDemo />
        </Box>
      {/* </VStack> */}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
