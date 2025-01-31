import { Transaction } from "./types";

export const calculateTotals = (transactions: Transaction[]) => {
  const now = new Date();
  const past30DaysTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const diffTime = Math.abs(now.getTime() - transactionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  });

  const sortedTransactions = past30DaysTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totals = sortedTransactions.reduce(
    (
      acc: { totalCredit: number; totalDebit: number },
      transaction: Transaction
    ) => {
      if (transaction.category === "credit") {
        acc.totalCredit += transaction.amount;
      } else if (transaction.category === "debit") {
        acc.totalDebit += transaction.amount;
      }
      return acc;
    },
    { totalCredit: 0, totalDebit: 0 }
  );

  return { sortedTransactions, ...totals };
};