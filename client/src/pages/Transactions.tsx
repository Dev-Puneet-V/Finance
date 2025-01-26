import React from "react";
import TransactionHeader from "../components/TransactionHeader";
import Table from "../components/Table";

const Transactions: React.FC = () => {
  return (
    <div>
      <p className="border-b font-bold text-3xl mt-6 text-slate-600 pb-1">
        Transactions
      </p>
      <div className="mt-5">
        <TransactionHeader />
        <Table />
      </div>
    </div>
  );
};

export default Transactions;
