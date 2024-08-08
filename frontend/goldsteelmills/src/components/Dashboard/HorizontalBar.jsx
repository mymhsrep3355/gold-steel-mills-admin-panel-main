import React, { useState, useEffect } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';
import { Chart } from 'primereact/chart';

export default function HorizontalBarDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#777';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#ddd';
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Achieved Revenue (in thousands)',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500') || '#007bff',
                    borderColor: documentStyle.getPropertyValue('--blue-500') || '#007bff',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Target Revenue (in thousands)',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500') || '#ff6384',
                    borderColor: documentStyle.getPropertyValue('--pink-500') || '#ff6384',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
        const options = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 1.0,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}k`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return `${value}k`;
                        },
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data)
        setChartOptions(options);
    }, []);

    return (
        <Flex direction="column" align="center" p={5} boxShadow="lg" borderRadius="md" bg="white" w="full" maxW="800px" mx="auto">
            <Heading as="h2" size="lg" mb={4}>
                Revenue Comparison
            </Heading>
            <Box w="100%" h="400px">
                <Chart type="bar" data={chartData} options={chartOptions} />
            </Box>
        </Flex>
    );
}
