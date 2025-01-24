import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer as PieContainer,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis as BarXAxis,
  YAxis as BarYAxis,
  CartesianGrid as BarGrid,
  Tooltip as BarTooltip,
  Legend,
  ResponsiveContainer as BarContainer,
} from "recharts";

// Mock Data for the charts
const incomeVsExpenses = [
  { month: "Jan", income: 3000, expense: 1500 },
  { month: "Feb", income: 3500, expense: 1600 },
  { month: "Mar", income: 4000, expense: 1800 },
  { month: "Apr", income: 4200, expense: 2000 },
  { month: "May", income: 4500, expense: 2200 },
];

const spendingByCategory = [
  { name: "Rent", value: 1200 },
  { name: "Groceries", value: 400 },
  { name: "Entertainment", value: 200 },
  { name: "Transportation", value: 100 },
];

const savingsGrowth = [
  { month: "Jan", savings: 5000 },
  { month: "Feb", savings: 5300 },
  { month: "Mar", savings: 5800 },
  { month: "Apr", savings: 6000 },
  { month: "May", savings: 6500 },
];

const Analytics: React.FC = () => {
  // Date range state
  const [dateRange, setDateRange] = useState<string>("last6months");
  const [loading, setLoading] = useState<boolean>(false);

  // Mock data fetching with delay to simulate real-time data loading
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate a 1.5s delay for data fetching
  }, []);

  // Date range change handler
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // Apply any necessary logic to filter the data by the selected date range
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
        <div>
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-4 py-2 text-sm bg-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="last6months">Last 6 Months</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="customRange">Custom Range</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center text-gray-600">Loading data...</div>
      ) : (
        <>
          {/* Income vs Expense Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Income vs. Expenses (Last 5 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <BarXAxis dataKey="month" />
                <BarYAxis />
                <Bar dataKey="income" fill="#82ca9d" />
                <Bar dataKey="expense" fill="#ff6f61" />
                <Tooltip />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Spending by Category Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Spending by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieContainer>
                <Pie
                  data={spendingByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  fill="#8884d8"
                  label
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        ["#ff8042", "#00C49F", "#FFBB28", "#0088FE"][index % 4]
                      }
                    />
                  ))}
                </Pie>
              </PieContainer>
            </ResponsiveContainer>
          </div>

          {/* Savings Growth Line Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Savings Growth (Last 5 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={savingsGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="savings" stroke="#8884d8" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Spending Categories */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Top Spending Categories
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between">
                <span className="text-gray-600">Rent</span>
                <span className="text-gray-800">$1200</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Groceries</span>
                <span className="text-gray-800">$400</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Entertainment</span>
                <span className="text-gray-800">$200</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Transportation</span>
                <span className="text-gray-800">$100</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
