import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

export const ResultsTable = ({ results }) => {
  return (
    <Table variant="striped" colorScheme="teal" mt={5}>
      <Thead>
        <Tr>
          <Th>Production ID</Th>
          <Th>Product Name</Th>
          <Th>Quantity</Th>
          <Th>Waste</Th>
          <Th>Date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {results.map((result) => (
          <Tr key={result._id}>
            <Td>{result._id}</Td>
            <Td>{result.product.name}</Td>
            <Td>{result.quantity}</Td>
            <Td>{result.waste}</Td>
            <Td>{new Date(result.date).toLocaleString()}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
