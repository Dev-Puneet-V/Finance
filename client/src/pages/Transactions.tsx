import React, { useEffect, useState } from "react";
import TransactionHeader from "../components/TransactionHeader";
import Table from "../components/Table";
import transactionsData from "../utils/testingData/transactions.json";
import { transactionTypeFilter } from "../utils/constant";

const Transactions: React.FC = () => {
  const [filters, setFilters] = useState({
    incomeType: 0,
    dateStart: null,
    dateEnd: null,
    searchValue: null,
  });
  const handleFilterChange = (newFilter: any) => {
    setFilters({
      ...filters,
      ...newFilter,
    });
  };
  useEffect(() => {
    console.log(filters);
  }, [filters.incomeType]);
  return (
    <div>
      <p className="border-b font-bold text-3xl mt-6 text-slate-600 pb-1">
        Transactions
      </p>
      <div className="mt-5">
        <TransactionHeader
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <Table
          columns={["amount", "description", "date"]}
          data={transactionsData
            .filter((curr: any) => {
              const updatedCurr = { ...curr };
              if (filters.incomeType > 0) {
                return (
                  (updatedCurr.category === "credit" &&
                    transactionTypeFilter[filters.incomeType].toLowerCase() ===
                      "income") ||
                  (updatedCurr.category === "debit" &&
                    transactionTypeFilter[filters.incomeType].toLowerCase() ===
                      "expense")
                );
              }
              return true;
            })
            .map((curr: any) => {
              const updatedCurr = { ...curr }; // Clone the object to avoid mutation
              if (updatedCurr.category === "credit") {
                updatedCurr.amount = (
                  <div className="text-green-500">+ {updatedCurr.amount}</div>
                );
              } else if (updatedCurr.category === "debit") {
                updatedCurr.amount = (
                  <div className="text-red-500">- {updatedCurr.amount}</div>
                );
              }
              delete updatedCurr.category; // Remove category from the clone
              return updatedCurr; // Return the modified clone
            })}
          currentPage={3}
          itemsPerPage={8}
          totalItems={0}
        />
      </div>
    </div>
  );
};

export default Transactions;
