import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Grid,
  GridItem,
  Heading,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";

const ContactUs = () => {
  const underlineColor = useColorModeValue("#9D152D", "#9D152D");
  return (
    <Box
      position="relative"
      backgroundImage="url('https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
      backgroundAttachment="fixed"
      py={{ base: "12", md: "24" }}
      px={{ base: "6", md: "12", lg: "24" }}
    >
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={10}
        alignItems="center"
      >
        <GridItem color="white">
          <Heading as="h2" size="xl" mb={4}>
            Request A Call Back
          </Heading>
          <Box
            w="450px"
            h="2px"
            bg={underlineColor}
            
            mt={1}
            mb={6}
            right={0}
          />
          <Text fontSize="lg" mb={4}>
            Have You Any Question About Us?
          </Text>
          <Text mb={4} fontSize={'sm'} color={'#9d9d9d'} fontWeight="200">
            Any kind of business solution and consultation hesitate to contact
            with us for customer support. We are love to hear from you.
          </Text>
          <Text fontSize={'sm'} color={'#9d9d9d'} fontWeight="300">Phone & Email:</Text>
          <Text fontSize={'sm'} color={'#9d9d9d'} fontWeight="200">
            For any information contact with us through our{" "}
            <Text fontSize={'sm'} color={'#9d9d9d'} as="span" textDecoration="underline" fontWeight="200">
              Email
            </Text>{" "}
            and you can also contact with directly by call us in this number{" "}
            <Text fontSize={'sm'} color={'#9d9d9d'} as="span" fontWeight="300">
            +92-305-6148001
            </Text>
          </Text>
        </GridItem>

        <GridItem>
          <form>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <FormControl isRequired mb={4}>
                <Input
                  placeholder="Your Name*"
                  bg="transparent"
                  borderColor="#9D152D"
                  borderWidth="1px"
                  color="white"
                  _placeholder={{ color: "white" }}
                />
              </FormControl>

              <FormControl isRequired mb={4}>
                <Input
                  placeholder="Your Mail*"
                  bg="transparent"
                  borderColor="#9D152D"
                  borderWidth="1px"
                  color="white"
                  _placeholder={{ color: "white" }}
                />
              </FormControl>

              <FormControl mb={4}>
                <Input
                  placeholder="Phone"
                  bg="transparent"
                  borderColor="#9D152D"
                  borderWidth="1px"
                  color="white"
                  _placeholder={{ color: "white" }}
                />
              </FormControl>

              <FormControl mb={4}>
                <Input
                  placeholder="Subject"
                  bg="transparent"
                  borderColor="#9D152D"
                  borderWidth="1px"
                  color="white"
                  _placeholder={{ color: "white" }}
                />
              </FormControl>
            </Grid>

            <FormControl isRequired mb={4}>
              <Textarea
                placeholder="Your Message.."
                bg="transparent"
                borderColor="#9D152D"
                borderWidth="1px"
                color="white"
                _placeholder={{ color: "white" }}
              />
            </FormControl>

            <Button
              bg="#9D152D"
              size="lg"
              width="full"
              _hover={{ bg: '#9d9d9d', color: 'white' }}
            >
              <Text color="white">SEND MESSAGE</Text>
            </Button>
          </form>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ContactUs;
