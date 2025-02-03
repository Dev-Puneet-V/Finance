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

const data = [
  { name: "Jan", credit: 100, debit: 2400, amt: 2400 },
  { name: "Feb", credit: 500, debit: 100, amt: 500 },
  { name: "Mar", credit: 300, debit: 400, amt: 400 },
];

export const formatPastOneYearTransactions = (transactions: Transaction[]) => {
  const now = new Date();
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );

  let filteredTransactions = transactions.filter((transaction: Transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate >= oneYearAgo &&
      transactionDate <= new Date(now.getFullYear(), now.getMonth() - 1, 31)
    );
  });
const groupedByMonth = filteredTransactions.reduce((acc, transaction) => {
  const month = new Date(transaction.date).toLocaleString("default", {
    month: "short",
  });
  
  if (!acc[month]) {
    acc[month] = { name: month, credit: 0, debit: 0, amt: 0 };
  }
  if (transaction.category === "credit") {
    acc[month].credit += transaction.amount;
  } else if (transaction.category === "debit") {
    acc[month].debit += transaction.amount;
  }
  acc[month].amt = Math.max(acc[month].credit, acc[month].debit);
  return acc;
}, {} as { [key: string]: { name: string; credit: number; debit: number; amt: number } });
  console.log(groupedByMonth);
  let ans = Object.keys(groupedByMonth).map((month: string) =>  groupedByMonth[month]);
  return ans;
};
