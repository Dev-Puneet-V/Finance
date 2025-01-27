import React, { useState } from "react";
import Search from "./Search";
import FilterButton from "./FilterButton";
import { durationOptions, transactionTypeFilter } from "../utils/constant";
import Select from "./Select";
import { DurationType } from "../utils/types";

const TransactionHeader: React.FC<any> = ({ filters, onFilterChange}) => {
  const [selectedOption, setSelectedOption] = useState<DurationType | null>(
    null
  );

  const handleSelectChange = (option: DurationType) => {
    setSelectedOption(option);
    onFilterChange({
      dateSelectionOption: option?.value,
    });
  };

  const handleDateChange = (type: "start" | "end") => (value: string) => {
    console.log(`${type} date changed:`, value);
    onFilterChange({
      ["date" + type.charAt(0).toUpperCase() + type.slice(1)]: value,
    });
  };

  const handleSearchChange = (e: any) => {
    onFilterChange({
      searchValue: e?.target.value
    });
  }

  const handleTypeChange = (value: number) => {
    onFilterChange({
      incomeType : value
    });
  }

  const renderCustomDateInputs = () => (
    <div className="mt-1 p-1 rounded-lg flex gap-2 justify-center items-center bg-gray-800">
      <input
        type="date"
        onChange={(e) => handleDateChange("start")(e.target.value)}
        className="cursor-pointer hover:bg-slate-300 px-2 py-2 text-sm bg-white text-slate-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        onChange={(e) => handleDateChange("end")(e.target.value)}
        className="cursor-pointer hover:bg-slate-300 px-2 py-2 text-sm bg-white text-slate-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-8">
        <Search placeholder="Search Transactions..." onInputChange={handleSearchChange} />
        <FilterButton options={transactionTypeFilter} onChange={handleTypeChange} />
      </div>

      <div className="flex gap-4 items-center justify-center">
        {selectedOption?.value === "custom" && renderCustomDateInputs()}
        <Select
          options={durationOptions}
          onChange={handleSelectChange}
          placeholder="Choose a Duration"
          value={selectedOption}
        />
      </div>
    </div>
  );
};

export default TransactionHeader;
