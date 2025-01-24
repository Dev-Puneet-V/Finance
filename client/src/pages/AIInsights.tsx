import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // Line chart for spending trends
import {
  BarChart,
  Bar,
  XAxis as BarXAxis,
  YAxis as BarYAxis,
  CartesianGrid as BarGrid,
  Tooltip as BarTooltip,
  Legend,
  ResponsiveContainer as BarContainer,
} from "recharts"; // Bar chart for budget recommendations

// Mock Data for AI Insights
const spendingTrends = [
  { month: "Jan", spending: 500 },
  { month: "Feb", spending: 600 },
  { month: "Mar", spending: 650 },
  { month: "Apr", spending: 700 },
  { month: "May", spending: 750 },
];

const budgetRecommendations = [
  { category: "Rent", recommended: 1500, actual: 1200 },
  { category: "Groceries", recommended: 300, actual: 400 },
  { category: "Entertainment", recommended: 200, actual: 250 },
  { category: "Savings", recommended: 500, actual: 400 },
];

const financialHealthScore = 75; // Out of 100

const ExpensePrediction = {
  nextMonth: 800, // Predicted expense for the next month
};

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulating an API call for loading data
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">AI Insights</h2>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center text-gray-600">Loading AI Insights...</div>
      ) : (
        <>
          {/* Spending Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Spending Trends (Last 5 Months)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={spendingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="spending" stroke="#8884d8" />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Budget Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Budget Recommendations vs. Actual
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarContainer>
                <BarChart data={budgetRecommendations}>
                  <BarXAxis dataKey="category" />
                  <BarYAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Bar dataKey="recommended" fill="#82ca9d" />
                  <Bar dataKey="actual" fill="#ff6f61" />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </BarContainer>
            </ResponsiveContainer>
          </div>

          {/* Financial Health Score */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Your Financial Health Score
            </h3>
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800">
                {financialHealthScore}%
              </div>
              <p className="mt-2 text-gray-600">
                Your financial health score reflects your savings, spending, and
                overall financial habits. Aim to increase this score!
              </p>
            </div>
          </div>

          {/* Expense Prediction for Next Month */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Next Month's Predicted Expenses
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800">
                ${ExpensePrediction.nextMonth}
              </div>
              <p className="mt-2 text-gray-600">
                This is an estimate based on your previous spending patterns.
                Plan accordingly!
              </p>
            </div>
          </div>

          {/* Personalized Insights */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Personalized Insights
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between text-gray-600">
                <span>Reduce spending on Entertainment</span>
                <span className="text-red-500">
                  Suggested savings: $50/month
                </span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Increase Savings by 10%</span>
                <span className="text-green-500">
                  Suggested savings: $100/month
                </span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Consider reducing Grocery spending</span>
                <span className="text-red-500">
                  Suggested savings: $50/month
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AIInsights;
