import { useState, useEffect } from "react";
import axios from "axios";
import { Table } from "../../components/Table.jsx";
import { PageHeader } from "../../components/PageHeader.jsx";
import { InputField } from "../../components/InputField.jsx";
import { Button } from "../../components/Button.jsx";
import { Modal } from "../../components/Modal.jsx";
import { SupplierCreate } from "../../components/SupplierCreate.jsx";
import { PaginatedButtons } from "../../components/PaginatedButtons.jsx";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils.js";
import { Spinner, Box, Text, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useAuthProvider } from "../../hooks/useAuthProvider.js";

export const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // To store input field value
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthProvider();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}suppliers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: pageNumber,
            limit: ITEMS_PER_PAGE,
            search: searchQuery, // Pass search query to backend
          },
        });

        console.log("API Response:", response.data);

        if (Array.isArray(response.data.suppliers)) {
          setSuppliers(response.data.suppliers);
          setTotalPages(response.data.totalPages);
        } else {
          setSuppliers([]);
        }
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setError("Failed to load suppliers.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchSuppliers();
  }, [token, pageNumber, searchQuery]); // Only searchQuery triggers data fetching

  const handleNavigation = (data) => {
    navigate("/supplier/edit", { state: data });
  };

  const handleSearch = () => {
    setPageNumber(1); // Reset to the first page on new search
    setSearchQuery(searchInput); // Update searchQuery with the input value
  };

  const goOnPrevPage = () => {
    if (!isFetching && pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const goOnNextPage = () => {
    if (!isFetching && pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };

  const handleRefresh = () => {
    setPageNumber(1);
    setSearchQuery("");
    setSearchInput(""); // Clear search input
    setSuppliers([]);
  };

  return (
    <div className="flex flex-col gap-3">
      <PageHeader title="Suppliers" />
      <InputGroup size="md">
        <InputField
          value={searchInput}
          setValue={setSearchInput}
          placeholder="Search"
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClickHandler={handleSearch}>
            Search
          </Button>
        </InputRightElement>
      </InputGroup>
      {isFetching ? (
        <Box textAlign="center" my={4}>
          <Spinner size="xl" color="teal.500" />
          <Text>Loading...</Text>
        </Box>
      ) : error ? (
        <Box textAlign="center" my={4}>
          <Text color="red.500">{error}</Text>
        </Box>
      ) : suppliers.length === 0 ? (
        <Text>No Data Found...</Text>
      ) : (
        <Table
          handleNavigation={handleNavigation}
          deleteURL={`${BASE_URL}/suppliers`}
          columns={["firstName", "lastName", "contactNumber"]}
          data={suppliers}
          refreshData={suppliers}
        />
      )}
      <PaginatedButtons
        hasMore={pageNumber < totalPages}
        currentPage={pageNumber}
        setCurrentPage={setPageNumber}
        totalDataCount={totalPages}
        ITEMS_PER_PAGE={ITEMS_PER_PAGE}
        goOnNextPage={goOnNextPage}
        goOnPrevPage={goOnPrevPage}
      />

      <div className="flex space-x-4">
        <Button title="Refresh" onClickHandler={handleRefresh}>
          <svg
            className="w-5 h-5 mx-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </Button>

        <Modal title="Add New Supplier">
          <SupplierCreate />
        </Modal>
      </div>
    </div>
  );
};
