import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { BASE_URL } from "../../utils";

export const ProductModal = ({ isOpen, onClose, productName, setProductName, stock, setStock, isEditing, productId, onSave }) => {
  const { token } = useAuthProvider();

  console.log(token);
  
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const url = isEditing ? `${BASE_URL}products/update/${productId}` : `${BASE_URL}products/register`;
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
        }),
      });
      console.log(response);
      
      if (response.ok) {
        onSave();
        console.log(response);
        
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
          <Input
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            mb={3}
          />
          <Input
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
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
