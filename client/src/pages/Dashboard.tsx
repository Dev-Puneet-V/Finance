import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"; // Chart library
import { CircularProgressbar } from "react-circular-progressbar"; // Circular progress bar
import Modal from "../components/Modal";
import { CreateTransaction } from "../components/CreateTransaction";

// Example data for charts and progress
const data = [
  { name: "Rent", value: 500 },
  { name: "Groceries", value: 200 },
  { name: "Entertainment", value: 100 },
  { name: "Transportation", value: 50 },
];

const Dashboard: React.FC = () => {
  const [transactionModalStatus, setTransactionModalStatus] = useState(false);
  const handleCreateTransactionModal = () => {
    setTransactionModalStatus(!transactionModalStatus);
  }
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-200" onClick={handleCreateTransactionModal}>
          Add Transaction
        </button>
      </div>

      {/* Financial Insights Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-700">
              Total Balance
            </h3>
            <p className="text-2xl font-bold text-green-600">$12,530.00</p>
          </div>
          <div className="text-gray-500 text-4xl">&#36;</div>
        </div>

        {/* Spending Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            Spending Breakdown
          </h3>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="80%"
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        ["#ff8042", "#00C49F", "#FFBB28", "#0088FE"][index % 4]
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Progress */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <h3 className="text-xl font-semibold text-gray-700">
            Savings Progress
          </h3>
          <div className="mt-6 flex justify-center items-center">
            <div className="w-20 h-20">
              <CircularProgressbar
                value={75}
                text={`${75}%`}
                styles={{
                  path: { stroke: "#00C49F" },
                  text: {
                    fill: "#00C49F",
                    fontSize: "18px",
                    fontWeight: "bold",
                  },
                }}
              />
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            You are 75% towards your savings goal
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700">
          Recent Transactions
        </h3>
        <ul className="mt-4 space-y-4">
          <li className="flex justify-between">
            <span className="text-gray-600">Amazon Purchase</span>
            <span className="text-red-500">-$45.00</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Salary Deposit</span>
            <span className="text-green-500">+$2,000.00</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">Coffee Shop</span>
            <span className="text-red-500">-$5.50</span>
          </li>
        </ul>
      </div>

      {/* Goals Progress Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700">
          Your Financial Goals
        </h3>
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Save for a Car</span>
            <span className="text-green-500">Goal: $5,000</span>
          </div>
          <div className="h-2 bg-gray-200 mt-2 rounded-full">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">$3,000 saved</p>
        </div>
      </div>
      {/* <Modal isOpen={transactionModalStatus} onClose={handleCreateTransactionModal}>
        <div>Hello</div>
      </Modal> */}
      {transactionModalStatus && <CreateTransaction onClose={handleCreateTransactionModal} />}
    </div>
  );
};

export default Dashboard;
