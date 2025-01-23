import React, { useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionHistory,
  setPageNumber,
} from "../utils/slices/transaction";
import { AppDispatch } from "../utils/store";

const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    transactions,
    loading,
    error,
    currentPageNumber,
    transactionCountPerPage,
  } = useSelector((state: any) => state.transaction);

  const columnHelper = createColumnHelper<any>();

  // Define table columns
  const columns = [
    columnHelper.accessor("_id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    }),
  ];

  let data =
    transactions?.length >= (currentPageNumber + 1) * transactionCountPerPage
      ? transactions.slice(
          currentPageNumber * transactionCountPerPage,
          (currentPageNumber + 1) * transactionCountPerPage
        )
      : transactions.slice(currentPageNumber * transactionCountPerPage);

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    // Fetch transaction history for the current page
    dispatch(
      getTransactionHistory({
        page: currentPageNumber,
        limit: transactionCountPerPage,
      })
    );
  }, [dispatch, currentPageNumber, transactionCountPerPage]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {transactions?.length > 0 ? (
        <table className="min-w-full table-auto border-separate border-spacing-0 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-100 cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 text-sm text-gray-800 max-w-[250px]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {currentPageNumber > 1 && <p
            onClick={() => {
              setPageNumber(currentPageNumber - 1);
            }}
          >
            Prev
          </p>}
          <p
            onClick={() => {
              setPageNumber(currentPageNumber + 1);
            }}
          >
            Next
          </p>
        </table>
      ) : (
        <p className="text-center text-gray-500">No transactions available</p>
      )}
    </div>
  );
};

export default TransactionHistory;
