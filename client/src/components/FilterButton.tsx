import React, { useState } from "react";
import { FilterButtonProps } from "../utils/types";

const FilterButton: React.FC<FilterButtonProps> = ({ options, onChange }) => {
  const [activeElement, setActiveElement] = useState<number>(0);

  const handleClick = (index: number) => {
    setActiveElement(index);
    if (onChange) onChange(index);
  };

  return (
    <div className="box-border flex items-center rounded-full shadow-lg  bg-slate-800 text-white">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className={`cursor-pointer flex-1 flex justify-center items-center h-full px-6 py-2 rounded-full transition-all duration-100 box-border ${
            activeElement === index
              ? "bg-slate-100 text-slate-100 shadow-lg font-bold m-1 bg-slate-900"
              : "hover:bg-slate-700 m-1"
          }`}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default FilterButton;
