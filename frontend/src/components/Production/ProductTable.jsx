import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

export const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <Table variant="striped" colorScheme="teal" mt={5} width="100%">
      <Thead>
        <Tr>
          <Th>Product Name</Th>
          <Th>Total Stock</Th>
          <Th>Waste</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product, index) => (
          <Tr key={index}>
            <Td>{product.name}</Td>
            <Td>{product.stock}</Td>
            <Td>{product.waste}</Td>
            <Td>
              <IconButton
                aria-label="Edit product"
                icon={<EditIcon />}
                mr={2}
                onClick={() => onEdit(product._id, product.name, product.stock, product.waste)}
              />
              <IconButton
                aria-label="Delete product"
                icon={<DeleteIcon />}
                onClick={() => onDelete(product._id)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
