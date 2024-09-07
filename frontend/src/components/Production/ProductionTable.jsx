import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

export const ProductionTable = ({ productions, onEdit, onDelete }) => {
  console.log("production Data", productions);
  
  return (
    <Table variant="striped" colorScheme="teal" mt={5}>
      <Thead>
        <Tr>
          <Th>Product ID</Th>
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
                onClick={() => onEdit(production._id)}
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
  );
};
