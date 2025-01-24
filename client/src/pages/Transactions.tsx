import React, { useState } from "react";

// Example Transaction Type
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      description: "Amazon Purchase",
      amount: -45.0,
      date: "2023-07-01",
      type: "expense",
    },
    {
      id: "2",
      description: "Salary",
      amount: 2000.0,
      date: "2023-06-30",
      type: "income",
    },
    {
      id: "3",
      description: "Coffee",
      amount: -5.5,
      date: "2023-06-29",
      type: "expense",
    },
    {
      id: "4",
      description: "Freelance Work",
      amount: 500.0,
      date: "2023-06-28",
      type: "income",
    },
  ]);

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  // Date Filter State
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Search and Filter Logic
  const filteredTransactions = transactions.filter((transaction) => {
    // Apply filter by transaction type
    if (filter !== "all" && transaction.type !== filter) {
      return false;
    }

    // Apply search filter by description
    if (
      search &&
      !transaction.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    // Apply date filter
    if (
      dateFilter === "last7days" &&
      new Date(transaction.date) <
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ) {
      return false;
    }

    if (
      dateFilter === "thisMonth" &&
      new Date(transaction.date).getMonth() !== new Date().getMonth()
    ) {
      return false;
    }

    if (
      dateFilter === "custom" &&
      (new Date(transaction.date) < new Date(customStartDate) ||
        new Date(transaction.date) > new Date(customEndDate))
    ) {
      return false;
    }

    return true;
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactionsPerPage] = useState<number>(5);

  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Form Validation States
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: "",
    description: "",
    amount: 0,
    date: "",
    type: "income",
  });
  const [errors, setErrors] = useState<{ description: string; amount: string }>(
    {
      description: "",
      amount: "",
    }
  );

  const validateForm = () => {
    let valid = true;
    const newErrors = { description: "", amount: "" };

    if (!newTransaction.description.trim()) {
      newErrors.description = "Description is required.";
      valid = false;
    }

    if (isNaN(newTransaction.amount) || newTransaction.amount === 0) {
      newErrors.amount = "Amount must be a valid number.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAddTransaction = () => {
    if (validateForm()) {
      setTransactions([
        ...transactions,
        {
          ...newTransaction,
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
        },
      ]);
      setShowModal(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>

      {/* Search and Filters */}
      <div className="my-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search Transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-md"
          />
          <button
            onClick={() => setFilter("all")}
            className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            All
          </button>
          <button
            onClick={() => setFilter("income")}
            className="px-4 py-2 text-sm bg-green-300 text-gray-800 rounded-md hover:bg-green-400 ml-2"
          >
            Income
          </button>
          <button
            onClick={() => setFilter("expense")}
            className="px-4 py-2 text-sm bg-red-300 text-gray-800 rounded-md hover:bg-red-400 ml-2"
          >
            Expense
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-md"
          >
            <option value="all">All Time</option>
            <option value="last7days">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
          {dateFilter === "custom" && (
            <div className="flex space-x-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-md"
              />
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-md"
              />
            </div>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Add Transaction
        </button>
      </div>

      {/* Transaction Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Description</th>
              <th className="px-4 py-2 text-left text-gray-600">Amount</th>
              <th className="px-4 py-2 text-left text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-2">{transaction.description}</td>
                <td
                  className={`px-4 py-2 ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.amount < 0
                    ? `-${Math.abs(transaction.amount)}`
                    : transaction.amount}
                </td>
                <td className="px-4 py-2">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevPage}
          className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2 text-sm text-gray-600">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 text-sm bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTransaction.description}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    description: e.target.value,
                  })
                }
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTransaction.amount}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    amount: Number(e.target.value),
                  })
                }
              />
              {errors.amount && (
                <span className="text-red-500 text-sm">{errors.amount}</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    type: e.target.value as "income" | "expense",
                  })
                }
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleAddTransaction}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
