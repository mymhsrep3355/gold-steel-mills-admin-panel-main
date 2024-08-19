import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, VStack, Heading, Flex } from "@chakra-ui/react";
import { PageHeader } from "../../components/PageHeader";
import PieChartDemo from "../../components/Dashboard/PieChart";
import HorizontalBarDemo from "../../components/Dashboard/HorizontalBar";
import InfoCard from "../../components/Dashboard/InfoCards";
import LineDemo from "../../components/Dashboard/LineChart";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

export const Dashboard = () => {
  const [reportData, setReportData] = useState({
    totalRevenues: 0,
    totalExpenses: 0,
    netProfitLoss: 0,
  });

  const { token } = useAuthProvider();

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}daybook/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  return (
    <Box p={3}>
      <SimpleGrid columns={[1, null, 3]} spacing={10} mt={5}>
        <InfoCard
          title="Total Revenue"
          totalNumber={`PKR ${reportData.totalRevenues.toLocaleString()}`}
          bgColor="#FF6F61"
        />

        <InfoCard
          title="Total Expenses"
          totalNumber={`PKR ${reportData.totalExpenses.toLocaleString()}`}
          bgColor="#FF6F61"
        />

        <InfoCard
          title="Net Profit/Loss"
          totalNumber={`PKR ${reportData.netProfitLoss.toLocaleString()}`}
          bgColor={reportData.netProfitLoss >= 0 ? "#4CAF50" : "#FF6F61"}
        />
      </SimpleGrid>

      {/* <Heading as="h2" size="lg" mt={10} mb={6} textAlign="center">
        Analytics
      </Heading>

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
      </SimpleGrid> */}
    </Box>
  );
};

export default Dashboard;
