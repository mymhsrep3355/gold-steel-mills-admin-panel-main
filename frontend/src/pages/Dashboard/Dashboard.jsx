import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  VStack,
  Heading,
  Flex,
  Select,
  Button,
} from "@chakra-ui/react";
import InfoCard from "../../components/Dashboard/InfoCards";
import axios from "axios";
import { BASE_URL } from "../../utils";
import { useAuthProvider } from "../../hooks/useAuthProvider";

export const Dashboard = () => {
  const [reportData, setReportData] = useState({
    totalRevenuesBank: 0,
    totalExpensesBank: 0,
    netProfitLossBank: 0,
    totalRevenuesCash: 0,
    totalExpensesCash: 0,
    netProfitLossCash: 0,
    netProfitLoss: 0,
  });

  const { token } = useAuthProvider();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth]); // Re-fetch data whenever the selected month changes

  const fetchReportData = async () => {
    try {
      const [year, month] = selectedMonth.split("-");
      const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];

      const response = await axios.get(
        `${BASE_URL}daybook/reports?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const monthsOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(0, i);
    return {
      value: `${new Date().getFullYear()}-${String(i + 1).padStart(2, "0")}`,
      label: date.toLocaleString("default", { month: "long" }),
    };
  });

  return (
    <Box p={3}>
      <VStack spacing={4} mb={4}>
        <Select value={selectedMonth} onChange={handleMonthChange}>
          {monthsOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </VStack>
      <SimpleGrid columns={[1, null, 3]} spacing={10} mt={5}>
        <InfoCard
          title="Total Bank Receivable"
          totalNumber={`PKR ${reportData.totalRevenuesBank.toLocaleString()}`}
          bgColor="#FF6F61"
        />
        <InfoCard
          title="Total Bank Expenses"
          totalNumber={`PKR ${reportData.totalExpensesBank.toLocaleString()}`}
          bgColor="#FF6F61"
        />
        <InfoCard
          title="Net Bank Profit/Loss"
          totalNumber={`PKR ${reportData.netProfitLossBank.toLocaleString()}`}
          bgColor={reportData.netProfitLossBank >= 0 ? "#4CAF50" : "#FF6F61"}
        />
      </SimpleGrid>

      <SimpleGrid columns={[1, null, 3]} spacing={10} mt={5}>
        <InfoCard
          title="Total Cash Receivable"
          totalNumber={`PKR ${reportData.totalRevenuesCash.toLocaleString()}`}
          bgColor="#FF6F61"
        />
        <InfoCard
          title="Total Cash Expenses"
          totalNumber={`PKR ${reportData.totalExpensesCash.toLocaleString()}`}
          bgColor="#FF6F61"
        />
        <InfoCard
          title="Net Cash Profit/Loss"
          totalNumber={`PKR ${reportData.netProfitLossCash.toLocaleString()}`}
          bgColor={reportData.netProfitLossCash >= 0 ? "#4CAF50" : "#FF6F61"}
        />
      </SimpleGrid>

      <SimpleGrid columns={[1, null, 1]} spacing={10} mt={5}>
        <InfoCard
          title="Overall Net Profit/Loss"
          totalNumber={`PKR ${reportData.netProfitLoss.toLocaleString()}`}
          bgColor={reportData.netProfitLoss >= 0 ? "#4CAF50" : "#FF6F61"}
        />
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
