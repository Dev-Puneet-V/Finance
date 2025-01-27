import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TableProps } from "../utils/types";

const Table: React.FC<TableProps> = ({
  columns,
  data,
  currentPage,
  totalItems, //TODO: this should come from backend
  itemsPerPage,
}) => {
  const [updatedCurrentPage, setUpdatedCurrentPage] = useState<number>(
    currentPage || 0
  );
  const [filteredData, setFilteredData] = useState<any>([]);

  // Total number of pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    setFilteredData(() => {
      const startIndex = updatedCurrentPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return data.slice(startIndex, endIndex);
    });
  }, [updatedCurrentPage, data, itemsPerPage]);

  const handlePrevPage = () => {
    if (updatedCurrentPage > 0) {
      setUpdatedCurrentPage(updatedCurrentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (updatedCurrentPage < totalPages - 1) {
      setUpdatedCurrentPage(updatedCurrentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setUpdatedCurrentPage(page);
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const visiblePages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than or equal to maxVisible
      for (let i = 0; i < totalPages; i++) visiblePages.push(i);
    } else {
      // Show first page
      visiblePages.push(0);

      // Ellipsis before current range
      if (updatedCurrentPage > 3) visiblePages.push("...");

      // Middle range of pages
      const start = Math.max(1, updatedCurrentPage - 1);
      const end = Math.min(totalPages - 2, updatedCurrentPage + 1);
      for (let i = start; i <= end; i++) visiblePages.push(i);

      // Ellipsis after current range
      if (updatedCurrentPage < totalPages - 4) visiblePages.push("...");

      // Show last page
        visiblePages.push(totalPages - 1);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="table-none md:table-fixed bg-slate-800 m-auto p-6 my-6 shadow-lg text-left shadow-lg sm:rounded-xl rounded shadow-lg">
      <table className="w-full text-sm text-gray-500 dark:text-gray-400 rounded max-h-400 ">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 ">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-100 bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 overflow-y-auto max-h-[400px] scrollbar">
          {filteredData.map((row: any) => (
            <tr
              key={row._id}
              className="bg-slate-900 hover:bg-gray-700 transition duration-200"
            >
              {Object.entries(row).map(
                ([key, cell]: [any, any], idx) =>
                  key !== "_id" && (
                    <td
                      scope="row"
                      key={idx}
                      className={`px-6 py-4 cursor-pointer ${
                        idx === 0 ? "font-bold" : ""
                      }`}
                    >
                      {cell}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 items-center h-10 mt-4 justify-center">
        {/* Previous Button */}
        <ChevronLeftIcon
          className={`h-6 w-6 text-white cursor-pointer ${
            updatedCurrentPage === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlePrevPage}
        />

        {/* Page Buttons */}
        <div className="flex gap-1">
          {visiblePages.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-3 py-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageClick(page as number)}
                className={`py-2 px-6 rounded-full text-sm ${
                  updatedCurrentPage === page
                    ? "bg-blue-500 text-white font-bold"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {+page + 1}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <ChevronRightIcon
          className={`h-6 w-6 text-white cursor-pointer ${
            updatedCurrentPage === totalPages - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleNextPage}
        />
      </div>
    </div>
  );
};

export default Table;
