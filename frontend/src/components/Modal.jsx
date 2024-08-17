import React, { useState } from "react";
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button as ChakraButton,
} from "@chakra-ui/react";
import { Button } from "./Button.jsx";

export const Modal = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button title={title} onClickHandler={() => setIsOpen(true)} />
      <ChakraModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <ChakraButton bg="teal.600" mr={3} onClick={() => setIsOpen(false)}>
              <Text color="white">Close</Text>
            </ChakraButton>
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    </>
  );
};
