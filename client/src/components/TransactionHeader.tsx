import React, { useState } from "react";
import Search from "./Search";
import FilterButton from "./FilterButton";
import { durationOptions, transactionTypeFilter } from "../utils/constant";
import Select from "./Select";
import { DurationType, Filters } from "../utils/types";

interface TransactionHeaderProps {
  filters: Filters;
  onFilterChange: (newFilter: Partial<Filters>) => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  filters,
  onFilterChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<DurationType | null>(
    null
  );

  const handleSelectChange = (option: DurationType) => {
    setSelectedOption(option);

    let dateStart: string | null | Date = null;
    let dateEnd: string | null | Date = new Date(); // Default end date is today

    switch (option.value) {
      case "24h":
        dateStart = new Date(Date.now() - 24 * 60 * 60 * 1000)
          
        console.log(dateStart)
        break;
      case "7d":
        dateStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          
        break;
      case "1m":
        dateStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          
        break;
      case "6m":
        dateStart = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
         
        break;
      case "1y":
        dateStart = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          
        break;
      case "custom":
        // For custom, we don't set dateStart and dateEnd initially
        dateStart = null;
        dateEnd = null;
        break;
      default:
        dateStart = null;
        dateEnd = null;
    }

    onFilterChange({
      dateStart,
      dateEnd,
    });
  };

  const handleDateChange = (type: "start" | "end") => (value: string) => {
    onFilterChange({
      [type === "start" ? "dateStart" : "dateEnd"]: value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      searchValue: e.target.value,
    });
  };

  const handleTypeChange = (value: number) => {
    onFilterChange({
      incomeType: value,
    });
  };

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
        <Search
          placeholder="Search Transactions..."
          onInputChange={handleSearchChange}
        />
        <FilterButton
          options={transactionTypeFilter}
          onChange={handleTypeChange}
        />
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
