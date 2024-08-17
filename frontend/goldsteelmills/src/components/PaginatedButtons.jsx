import { Box, Select } from '@chakra-ui/react';
import { Button } from './Button.jsx';

// eslint-disable-next-line react/prop-types
export const PaginatedButtons = ({ currentPage, setCurrentPage, totalDataCount, hasMore, ITEMS_PER_PAGE, goOnPrevPage, goOnNextPage }) => {
  const totalPages = totalDataCount

  const handlePageChange = (e) => {
    const selectedPage = parseInt(e.target.value);
    if (!isNaN(selectedPage) && selectedPage !== currentPage) {
      setCurrentPage(selectedPage);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
      <Box display="flex" alignItems="center">
        <span>Page:</span>
        <Select
          ml={2}
          value={currentPage}
          onChange={handlePageChange}
          width="auto"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </Select>
      </Box>
      <Box display="flex" gap={2}>
        {currentPage > 1 && (
          <Button title="Prev" onClickHandler={goOnPrevPage} />
        )}
        {hasMore && (
          <Button title="Next" onClickHandler={goOnNextPage} />
        )}
      </Box>
    </Box>
  );
};
