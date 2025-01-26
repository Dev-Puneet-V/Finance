import React, { useState, useRef, useEffect } from "react";
import { SelectProps, SelectOption } from "../utils/types";

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  value = null,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: SelectOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm" ref={selectRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`min-w-[180px] gap-3 bg-slate-800 px-4 py-3 flex items-center justify-between cursor-pointer transition ${
          isOpen ? "rounded-t-lg" : "rounded-lg"
        }`}
      >
        <span className={`text-gray-100 ${!value ? "text-gray-400" : ""}`}>
          {value ? value.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-100 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <ul className="absolute z-10 w-full bg-slate-800  rounded-b-lg shadow-lg max-h-60 overflow-auto text-white  scrollbar ">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-3 cursor-pointer hover:bg-slate-900  ${
                value?.value === option.value
                  ? "bg-slate-900 text-white"
                  : "text-gray-400"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
