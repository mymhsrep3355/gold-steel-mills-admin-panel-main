import { PageHeader } from "../../components/PageHeader.jsx";

import { InputField } from "../../components/InputField.jsx";
import { Table } from "../../components/Table.jsx";
import { Button } from "../../components/Button.jsx";
import { Modal } from "../../components/Modal.jsx";
import { PaginatedButtons } from "../../components/PaginatedButtons.jsx";
import { PurchaseCreate } from "../../components/PurchaseCreate.jsx";
import { useState } from "react";
import { useFetchSource } from "../../hooks/useFetchSource.js";
import { useNavigate } from "react-router-dom";

export const Production = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, refresh, isFetching } = useFetchSource(
    `purchases`,
    pageNumber,
    { name: "supplierName", value: searchQuery }
  );
  const goOnPrevPage = () => {
    if (!isFetching) setPageNumber(pageNumber - 1);
  };
  // Handle next page button click
  const goOnNextPage = () => {
    if (!isFetching) setPageNumber(pageNumber + 1);
  };
  const handleNavigation = (data) => {
    navigate("/purchase/edit", { state: data });
  };
  return (
    <div className="flex flex-col gap-3">
      <PageHeader title="Purchases" />
      <InputField
        value={searchQuery}
        setValue={setSearchQuery}
        placeholder="Search*"
      />
      {data.length === 0 ? (
        "No Data Found..."
      ) : (
        <Table
          handleNavigation={handleNavigation}
          deleteURL={"purchases"}
          columns={[
            "supplierName",
            "itemName",
            "quantity",
            "price",
            "kaat",
            "total",
            "createdAt",
          ]}
          data={data.purchases ?? []}
        />
      )}

      <PaginatedButtons
        hasMore={data?.hasMore}
        currentPage={pageNumber}
        setCurrentPage={setPageNumber}
        totalDataCount={data.total ?? 0}
        ITEMS_PER_PAGE={10}
        goOnNextPage={goOnNextPage}
        goOnPrevPage={goOnPrevPage}
      />
      <div className="flex space-x-4">
        <Button title="Refresh" onClickHandler={refresh}>
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
        {/* Add new supplier modal */}
        <Modal title="Add New Purchase">
          <PurchaseCreate />
        </Modal>
      </div>
    </div>
  );
};
