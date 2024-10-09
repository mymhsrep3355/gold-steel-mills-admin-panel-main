import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

export const ProductModal = ({
  isOpen,
  onClose,
  productName,
  setProductName,
  stock,
  setStock,
  isEditing,
  productId,
  onSave,
  waste,
  setWaste
}) => {
  const { token } = useAuthProvider();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const url = isEditing
      ? `${BASE_URL}products/update/${productId}`
      : `${BASE_URL}products/register`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productName,
          stock: Number(stock),
          waste: Number(waste) // Assuming waste should be sent in the request body
        }),
      });

      if (response.ok) {
        onSave();
      } else {
        console.error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? "Edit Product" : "Create New Product"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Product Name</FormLabel>
            <Input
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Stock</FormLabel>
            <Input
              placeholder="Enter stock quantity"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </FormControl>
          {/* <FormControl mb={3}>
            <FormLabel>Waste</FormLabel>
            <Input
              placeholder="Enter waste amount"
              type="number"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
            />
          </FormControl> */}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={handleSave}
            isLoading={loading}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
