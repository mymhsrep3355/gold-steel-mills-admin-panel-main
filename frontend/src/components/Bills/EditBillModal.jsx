import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";

const EditBillModal = ({ isOpen, onClose, bill, items, onUpdate }) => {
  const [formData, setFormData] = useState({
    weight: "",
    itemType: "",
    quantity: "",
    vehicle_no: "",
    rate: "",
    total: "",
    gatePassNo: "",
    bill_no: "",
    date: "",
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        weight: bill.weight,
        itemType: bill.itemType._id,
        quantity: bill.quantity,
        vehicle_no: bill.vehicle_no,
        rate: bill.rate,
        total: bill.total,
        gatePassNo: bill.gatePassNo,
        bill_no: bill.bill_no,
        date: new Date(bill.date).toISOString().split("T")[0],
      });
    }
  }, [bill]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(bill._id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Bill</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Item Type</FormLabel>
            <Select
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
            >
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Weight</FormLabel>
            <Input
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Quantity</FormLabel>
            <Input
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Vehicle Number</FormLabel>
            <Input
              name="vehicle_no"
              type="text"
              value={formData.vehicle_no}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Rate</FormLabel>
            <Input
              name="rate"
              type="number"
              value={formData.rate}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Total</FormLabel>
            <Input
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Gate Pass Number</FormLabel>
            <Input
              name="gatePassNo"
              type="text"
              value={formData.gatePassNo}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Bill Number</FormLabel>
            <Input
              name="bill_no"
              type="text"
              value={formData.bill_no}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Date</FormLabel>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditBillModal;
