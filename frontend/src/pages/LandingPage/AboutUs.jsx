import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Icon,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { FaUserTie, FaIndustry, FaProjectDiagram } from 'react-icons/fa';
import MillWork from "../../../public/c3.jpeg";

const AboutUs = () => {
  const [engineers, setEngineers] = useState(0);
  const [experience, setExperience] = useState(0);
  const [projects, setProjects] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineers((prev) => (prev < 256 ? prev + 1 : 256));
      setExperience((prev) => (prev < 40 ? prev + 1 : 40));
      setProjects((prev) => (prev < 3250 ? prev + 10 : 3250));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box maxW="1200px" mx="auto" p={8}>
      <SimpleGrid columns={[1, 2]} spacing={10} alignItems="center">
        <Box>
          <Image
            src={MillWork}
            alt="Steel Mill"
            borderRadius="md"
          />
        </Box>

        <Box mt={8}>
            <Heading as="h2" size="xl" color="red.800" mb={4}>
               <Text color={'black'}>WELCOME TO </Text>WHITE GOLD STEEL MILLS
            </Heading>
            <Text fontSize="md" mb={4} color="gray.600" lineHeight="tall">
              Gold Steel Steel Mills is currently one of the largest and fastest-growing
              metal scrap buyers & Recyclers in Pakistan in terms of production capacity
              and rolling speed. The company has since its inception in 1985 excelled
              exceptionally in manufacturing different metal products. We take pride
              not only in our technical superiority over other re-rolling mills but also
              in our corporate setup
            </Text>
            <Divider my={6} borderColor="gray.400" />
            <SimpleGrid columns={[1, 3]} spacing={8}>
              <Flex direction="column" align="center">
                <Icon as={FaUserTie} boxSize={12} color="red.800" />
                <Text fontSize="2xl" fontWeight="bold">
                  {engineers}+
                </Text>
                <Text fontSize="sm" color="gray.500">Engineers & Workers</Text>
              </Flex>
              <Flex direction="column" align="center">
                <Icon as={FaIndustry} boxSize={12} color="red.800" />
                <Text fontSize="2xl" fontWeight="bold">
                  {experience}+
                </Text>
                <Text fontSize="sm" color="gray.500">Years of Experience</Text>
              </Flex>
              <Flex direction="column" align="center">
                <Icon as={FaProjectDiagram} boxSize={12} color="red.800" />
                <Text fontSize="2xl" fontWeight="bold">
                  {projects}+
                </Text>
                <Text fontSize="sm" color="gray.500">Projects Completed</Text>
              </Flex>
            </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default AboutUs;
