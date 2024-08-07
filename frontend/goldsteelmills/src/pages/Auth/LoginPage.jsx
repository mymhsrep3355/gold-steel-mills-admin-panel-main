// import { useState } from 'react';
// import axios from "axios";
// import {useAuthProvider} from "../../hooks/useAuthProvider.js";
// import {Navigate, useNavigate} from "react-router-dom";

// export const LoginPage = () => {
//     const navigation=useNavigate()
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error,setError]=useState('')
//     const {setUser,setToken}=useAuthProvider();
//     // const handleSubmit = () =>{
//     //     navigation("/");
//     // }
//     const handleSubmit = async(e) => {
//         e.preventDefault();
//         // Handle login logic here
//       try {
//          const res= await axios.post("http://localhost:8080/api/v1/auth/login",{
//               username,password
//           })
//           const {user,token}=res.data
//           setUser(user)
//           setToken(token)
//           navigation("/")
//           //login success
//       }catch(e){
//           //login failed
//           console.log(e)
//             setError(e.response.data.error)
//       }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
//                 <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
//                 <form className="space-y-6" onSubmit={handleSubmit}>
//                     <div className="form-control">
//                         <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">
//                             Username
//                         </label>
//                         <input
//                             type="text"
//                             id="username"
//                             name="username"
//                             className="input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="form-control">
//                         <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             className="input w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     {error?<h1 className={'text-sm text-red-500'}>{error}</h1>:''}
//                     <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
//                         Login
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  Heading,
  useToast,
  Flex,
  useColorModeValue,
  Image,
  Divider,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationLogin from "../../../public/animations/loginAnimation.json";
import logo from "../../../public/logo.jpeg";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser, setToken } = useAuthProvider();
  const toast = useToast();

  const handleSubmit = () =>{
       navigate("/");
   }
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
  //       email,
  //       password,
  //     });
  //     const { user, token } = res.data;
  //     setUser(user);
  //     setToken(token);
  //     navigate("/");
  //     toast({
  //       title: "Login successful.",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     setError(e.response.data.error);
  //     toast({
  //       title: "Login failed.",
  //       description: e.response.data.error,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.100", "gray.900")}
      p={5}
    >
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
        w="90%"
        maxW="1200px"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box
          flex="1"
          display={{ base: "none", md: "flex" }}
          justifyContent="center"
          alignItems="center"
          p={5}
        >
          <Lottie
            animationData={animationLogin}
            style={{ width: "80%", maxWidth: "500px" }}
          />
        </Box>
        <Box
          flex="1"
          p={8}
          bg={useColorModeValue("white", "gray.800")}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <VStack spacing={5} align="stretch">
            <Flex justifyContent="center">
              <Image src={logo} alt="Logo" w={"110px"} alignSelf="center" />
            </Flex>
            <Heading
              as="h2"
              size="lg"
              textAlign="center"
              color={useColorModeValue("gray.800", "white")}
            >
              Admin Login
            </Heading>
            <Divider />
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    borderRadius={25}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    focusBorderColor="blue.500"
                    bg={useColorModeValue("gray.100", "gray.700")}
                    _placeholder={{
                      color: useColorModeValue("gray.500", "gray.300"),
                    }}
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      borderRadius={25}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      focusBorderColor="blue.500"
                      bg={useColorModeValue("gray.100", "gray.700")}
                      _placeholder={{
                        color: useColorModeValue("gray.500", "gray.300"),
                      }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle Password Visibility"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={togglePasswordVisibility}
                        variant="ghost"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                {error && (
                  <Text color="red.500" fontSize="sm">
                    {error}
                  </Text>
                )}
                <Button
                  mt={6}
                  borderRadius={25}
                  type="submit"
                  colorScheme="blue"
                  w="70%"
                  bg="blue.500"
                  _hover={{ bg: "blue.600" }}
                  _focus={{ boxShadow: "outline" }}
                >
                  Login
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
};
