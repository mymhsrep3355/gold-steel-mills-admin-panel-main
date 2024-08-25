import React, { useState, useEffect } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { Chart } from 'primereact/chart';

export default function PieChartDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: ['Sales', 'A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702, 421],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500').trim(), 
                        documentStyle.getPropertyValue('--yellow-500').trim(), 
                        documentStyle.getPropertyValue('--green-500').trim(),
                        documentStyle.getPropertyValue('--red-500').trim()
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400').trim(), 
                        documentStyle.getPropertyValue('--yellow-400').trim(), 
                        documentStyle.getPropertyValue('--green-400').trim(),
                        documentStyle.getPropertyValue('--red-400').trim()
                    ]
                }
            ]
        };
        const options = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <Flex direction="column" align="center" p={5} boxShadow="lg" borderRadius="md" bg="white">
            <Heading as="h2" size="lg" mb={4}>
                Sales Data
            </Heading>
            <Box width="90%" maxWidth="600px">
                <Chart type="pie" data={chartData} options={chartOptions} />
            </Box>
        </Flex>
    );
}
