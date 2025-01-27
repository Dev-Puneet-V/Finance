// utils/filterTransactions.ts
import { transactionTypeFilter } from "./constant";
import { Transaction, Filters } from "./types";

export const filterTransactions = (
  transactions: Transaction[],
  filters: Filters
): Transaction[] => {
  const { incomeType, dateStart, dateEnd, searchValue } = filters;

  return transactions.filter((transaction) => {
    // Filter by income type
    if (incomeType > 0) {
      const isIncome = transaction.category === "credit";
      const isExpense = transaction.category === "debit";
      const selectedType = transactionTypeFilter[incomeType].toLowerCase();

      if (
        (selectedType === "income" && !isIncome) ||
        (selectedType === "expense" && !isExpense)
      ) {
        return false;
      }
    }

    // Filter by date range
    if (dateStart && dateEnd) {
      const transactionDate = new Date(transaction.date).getTime();
      const startDate = new Date(dateStart).getTime();
      const endDate = new Date(dateEnd).getTime();

      if (transactionDate < startDate || transactionDate > endDate) {
        return false;
      }
    }

    // Filter by search value
    if (searchValue.trim().length >= 3) {
      const searchQuery = searchValue.trim().toLowerCase();
      if (!transaction.description.toLowerCase().includes(searchQuery)) {
        return false;
      }
    }

    return true;
  });
};
