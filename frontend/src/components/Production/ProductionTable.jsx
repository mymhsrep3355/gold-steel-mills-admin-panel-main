import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils"; // Make sure the path to your utils file is correct
import { useAuthProvider } from "../../hooks/useAuthProvider";

export const ProductionTable = ({ productions, onDelete, fetchProductions }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingProduction, setEditingProduction] = useState(null);
  const [newWaste, setNewWaste] = useState("");
  const { token } = useAuthProvider();
  const toast = useToast();

  // Handle edit button click to open the modal with the selected production
  const handleEditClick = (production) => {
    setEditingProduction(production);
    setNewWaste(production.waste);
    onOpen();
  };

  // Handle form submission to update the production waste via API call
  const handleSave = async () => {
    if (isNaN(newWaste) || newWaste < 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid waste amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log("Printing the token")
      console.log(token)
      // Making API call to update the waste
      const response = await axios.put(`${BASE_URL}productions/updateWaste`, {
        productionId: editingProduction._id,
        waste: parseFloat(newWaste),
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
      );

      toast({
        title: "Production updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // // Refresh the data after successful update
      // if (response.status === 200) {
      //   try{
      //     const response = await axios.get(`${BASE_URL}productions`, {
      //       headers: {
      //         "Content-Type": "application/json",
      //         "Authorization": `Bearer ${token}`,
      //       },  
      //     })
      //   }
      //   catch(error){
      //     console.log(error)
      //     toast({
      //       title: "Failed to get productions",
      //       status: "error",
      //       duration: 3000,
      //       isClosable: true,

      //     })
      //   }
      // }

      onClose();
    } catch (error) {
      console.error("Error updating production:", error);
      toast({
        title: "Failed to update production.",
        description: error?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Table variant="striped" colorScheme="teal" mt={5}>
        <Thead>
          <Tr>
            <Th>Product Name</Th>
            <Th>Quantity</Th>
            <Th>Waste</Th>
            <Th>Subtotal</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {productions.map((production, index) => (
            <Tr key={index}>
              <Td>{production?.product?.name}</Td>
              <Td>{production.quantity}</Td>
              <Td>{production.waste}</Td>
              <Td>{production.quantity - production.waste}</Td>
              <Td>
                <IconButton
                  aria-label="Edit production"
                  icon={<EditIcon />}
                  mr={2}
                  onClick={() => handleEditClick(production)}
                />
                <IconButton
                  aria-label="Delete production"
                  icon={<DeleteIcon />}
                  onClick={() => onDelete(production._id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Waste</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="number"
              value={newWaste}
              onChange={(e) => setNewWaste(e.target.value)}
              placeholder="Enter new waste amount"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
