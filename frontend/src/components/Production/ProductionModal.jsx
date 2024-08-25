import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Input, Select } from "@chakra-ui/react";
import { useAuthProvider } from "../../hooks/useAuthProvider";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils";

export const ProductionModal = ({
  isOpen,
  onClose,
  selectedProduct,
  setSelectedProduct,
  products,
  quantity,
  setQuantity,
  waste,
  setWaste,
  subtotal,
  onSave,
  calculateSubtotal
}) => {
  const { token } = useAuthProvider();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${BASE_URL}productions/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          product: selectedProduct,
          quantity: Number(quantity),
          waste: Number(waste),
        }),
      });
      console.log(response);
      if (response.ok) {
        onSave(); 
      } else {
        console.error("Failed to create production");
      }
    } catch (error) {
      console.error("Error creating production:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
    calculateSubtotal(newQuantity, waste);
  };

  const handleWasteChange = (e) => {
    const newWaste = e.target.value;
    setWaste(newWaste);
    calculateSubtotal(quantity, newWaste);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Production</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            placeholder="Select Product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            mb={3}
          >
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            mb={3}
          />
          <Input
            placeholder="Waste"
            type="number"
            value={waste}
            onChange={handleWasteChange}
          />
          <p>Subtotal: {subtotal}</p>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSave} isLoading={loading}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
