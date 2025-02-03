import React, { useEffect, useState } from "react";
import TransactionHeader from "../components/TransactionHeader";
import Table from "../components/Table";
import { filterTransactions } from "../utils/filterTransaction";
import { Filters } from "../utils/types";
import { AppDispatch, RootState } from "../utils/store"; // Adjust the import path as needed
import { getTransactionHistory } from "../utils/slices/transaction";
import { useDispatch, useSelector } from "react-redux";

const Transactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    transactions,
    loading,
    error,
    currentPageNumber,
    transactionCountPerPage,
  } = useSelector((state: RootState) => state.transaction);
  const [filters, setFilters] = useState<Filters>({
    incomeType: 0,
    dateStart: null,
    dateEnd: null,
    searchValue: "",
  });

  useEffect(() => {
    if (transactions.length === 0) {
      dispatch(
        getTransactionHistory({
          page: currentPageNumber,
          limit: transactionCountPerPage,
        })
      );
    }
  }, [
    dispatch,
    transactions.lengthdispatch,
    transactions.length,
    currentPageNumber,
    transactionCountPerPage,
  ]);
  const handleFilterChange = (newFilter: Partial<Filters>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilter,
    }));
  };

  const filteredTransactions = filterTransactions(transactions, filters);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
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
          columns={["description", "date", "amount"]}
          data={filteredTransactions
            .sort((a, b) => {
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .map((transaction) => ({
              description: transaction.description,
              date:
                transaction.date.toString().split("T")[0] +
                " " +
                transaction.date.toString().split("T")[1].split(".")[0],
              amount:
                transaction.category === "credit" ? (
                  <div className="text-green-500">+ {transaction.amount}</div>
                ) : (
                  <div className="text-red-500">- {transaction.amount}</div>
                ),
            }))}
          currentPage={3}
          itemsPerPage={8}
          totalItems={filteredTransactions?.length}
        />
      </div>
    </div>
  );
};

export default Transactions;
