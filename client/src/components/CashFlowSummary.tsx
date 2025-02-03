import { Legend, LineChart, Tooltip } from "recharts";
import React from "react";
import { Line, XAxis, YAxis } from "recharts";
import { formatPastOneYearTransactions } from "../utils/helpers";
import { useSelector } from "react-redux";
import { RootState } from "../utils/store";

const CashFlowSummary: React.FC = () => {
  const { transactions } = useSelector((state: RootState) => state.transaction);
  //TODO:  it should not load once transaction is loaded
  const data = formatPastOneYearTransactions(transactions);
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis dataKey="amt" />
        {/* <CartesianGrid stroke="#eee" strokeDasharray="5 5" /> */}
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="credit" stroke="green" />
        <Line type="monotone" dataKey="debit" stroke="red" />
      </LineChart>
    </div>
  );
};

export default CashFlowSummary;
