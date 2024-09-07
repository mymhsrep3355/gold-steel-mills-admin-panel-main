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
  Select
} from "@chakra-ui/react";
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
  calculateSubtotal,
  mode, // New prop to handle mode
  productionId = null // New prop for the ID in edit mode
}) => {
  const { token } = useAuthProvider();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const url = mode === "create"
      ? `${BASE_URL}productions/register`
      : `${BASE_URL}productions/${productionId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
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

      if (response.ok) {
        onSave(); 
      } else {
        console.error(`Failed to ${mode} production`);
      }
    } catch (error) {
      console.error(`Error ${mode} production:`, error);
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

  useEffect(() => {
    if (mode === "edit" && selectedProduct) {
      // Fetch existing data if in edit mode
      const fetchData = async () => {
        try {
          const response = await fetch(`${BASE_URL}productions/${productionId}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          const data = await response.json();
          setSelectedProduct(data.product);
          setQuantity(data.quantity);
          setWaste(data.waste);
          calculateSubtotal(data.quantity, data.waste);
        } catch (error) {
          console.error("Error fetching production data:", error);
        }
      };

      fetchData();
    }
  }, [mode, productionId, token, setSelectedProduct, setQuantity, setWaste, calculateSubtotal]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{mode === "create" ? "Create New Production" : "Edit Production"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {mode==='create'&&(<>
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


        </>)}
      <label>Enter Quantity</label>
          <Input
            placeholder="Quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            mb={3}
          />
            <label>Enter Waste</label>
          <Input
            placeholder="Waste"
            type="number"
            value={waste}
            onChange={handleWasteChange}
          />

          {mode==='create'&&(<>
            <p>Subtotal: {subtotal}</p>

          </>)}
        
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSave} isLoading={loading}>
            {mode === "create" ? "Save" : "Update"}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
