import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  TableCaption,
  useDisclosure,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

const DaybookTable = ({ daybooks, onEdit, onDelete }) => {
  return (
    <Box mt={8}>
      <Table variant="striped" colorScheme="teal">
        <TableCaption>Daybook entries for Daybook</TableCaption>
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Description</Th>
            <Th>Amount</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {daybooks.map((entry) => (
            <Tr key={entry._id}>
              <Td>{new Date(entry.date).toLocaleDateString()}</Td>
              <Td>{entry.description}</Td>
              <Td>{entry.amount}</Td>
              <Td>{entry.type}</Td>
              <Td>
                <IconButton
                  aria-label="Edit entry"
                  icon={<EditIcon />}
                  mr={2}
                  onClick={() => onEdit(entry)}
                />
                <IconButton
                  aria-label="Delete entry"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => onDelete(entry._id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DaybookTable;
