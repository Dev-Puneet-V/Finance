import { useSelector } from "react-redux";
import { RootState } from "../utils/store";
import { calculateTotals } from "../utils/helpers";

const QuickTransactionGlace: React.FC = () => {
  const { transactions } = useSelector((state: RootState) => state.transaction);
  const { totalCredit, totalDebit } = calculateTotals(transactions);

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
      <p className="text-lg font-semibold">
        Recent Transactions Summary (Past 30 Days)
      </p>
      <div className="mt-4 bg-gray-600 p-4 rounded-lg shadow-md">
        <p className="text-green-400">Total Credit: {totalCredit.toFixed(2)}</p>
        <p className="text-red-400">Total Debit: {totalDebit.toFixed(2)}</p>
        <p className="text-yellow-400">
          Total: {(totalCredit - totalDebit).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default QuickTransactionGlace;
