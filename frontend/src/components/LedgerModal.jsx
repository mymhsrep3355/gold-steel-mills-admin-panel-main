import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";

const LedgerModal = ({ isOpen, onClose, ledgerData }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Supplier Ledger</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {ledgerData && ledgerData.length > 0 ? (
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th isNumeric>Debit</Th>
                  <Th isNumeric>Credit</Th>
                  <Th isNumeric>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ledgerData.map((entry) => (
                  <Tr key={entry._id}>
                    <Td>{new Date(entry.date).toLocaleDateString()}</Td>
                    <Td>{entry.description}</Td>
                    <Td isNumeric>{entry.debit ? entry.debit.toLocaleString() : "-"}</Td>
                    <Td isNumeric>{entry.credit ? entry.credit.toLocaleString() : "-"}</Td>
                    <Td isNumeric>{entry.balance.toLocaleString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No Ledger Data Available</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LedgerModal;
