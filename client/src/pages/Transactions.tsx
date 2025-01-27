import React, { useEffect, useState } from "react";
import TransactionHeader from "../components/TransactionHeader";
import Table from "../components/Table";
import transactionsData from "../utils/testingData/transactions.json";
import { filterTransactions } from "../utils/filterTransaction";
import { Filters } from "../utils/types";

const Transactions: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    incomeType: 0,
    dateStart: null,
    dateEnd: null,
    searchValue: "",
  });

  const handleFilterChange = (newFilter: Partial<Filters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilter,
    }));
  };

  const filteredTransactions = filterTransactions(transactionsData, filters);

  useEffect(() => {
    console.log("Applied Filters:", filters);
  }, [filters]);

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
          columns={["amount", "type", "description", "date"]}
          data={filteredTransactions.map((transaction) => ({
            ...transaction,
            amount:
              transaction.category === "credit" ? (
                <div className="text-green-500">+ {transaction.amount}</div>
              ) : (
                <div className="text-red-500">- {transaction.amount}</div>
              ),
          }))}
          currentPage={3}
          itemsPerPage={8}
          totalItems={filteredTransactions.length}
        />
      </div>
    </div>
  );
};

export default Transactions;
