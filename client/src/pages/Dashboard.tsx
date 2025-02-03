import React, { useState } from "react";
// import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"; // Chart library
// import { CircularProgressbar } from "react-circular-progressbar"; // Circular progress bar
// import Modal from "../components/Modal";
import { CreateTransaction } from "../components/CreateTransaction";
import QuickTransactionGlace from "../components/QuickTransactionGlace";
import CashFlowSummary from "../components/CashFlowSummary";

// Example data for charts and progress
// const data = [
//   { name: "Rent", value: 500 },
//   { name: "Groceries", value: 200 },
//   { name: "Entertainment", value: 100 },
//   { name: "Transportation", value: 50 },
// ];

const Dashboard: React.FC = () => {
  const [transactionModalStatus, setTransactionModalStatus] = useState(false);
  const handleCreateTransactionModal = () => {
    setTransactionModalStatus(!transactionModalStatus);
  };
  return (
    <div className="space-y-6 mt-5">
      <div className="flex justify-between items-center border-b text-slate-600 pb-1">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200"
          onClick={handleCreateTransactionModal}
        >
          Add Transaction
        </button>
      </div>
      <div>
        <div className="flex gap-4 ">
          <QuickTransactionGlace />
        </div>
        <div className="my-3">
          <CashFlowSummary />
        </div>
      </div>
      {transactionModalStatus && (
        <CreateTransaction onClose={handleCreateTransactionModal} />
      )}
    </div>
  );
};

export default Dashboard;
