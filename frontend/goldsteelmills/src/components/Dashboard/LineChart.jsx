import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Box, Heading, Flex } from '@chakra-ui/react';

export default function LineDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Achieved Sales (in tons)',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--red-600'),
                    tension: 0.4
                },
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.9,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
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
                Steel Sales Market
            </Heading>
            <Box width="90%" maxWidth="600px">
                <Chart type='line' data={chartData} options={chartOptions} />
            </Box>
        </Flex>
    )
}
        