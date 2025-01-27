import React from "react";
import { SearchProps } from "../utils/types";

const Search: React.FC<SearchProps> = (props) => {
  const { placeholder = "Search something....", onInputChange } = props;
  return (
    <div>
      <input
        className="shadow outline-none focus:outline-none rounded-full py-3 px-5 text-grey bg-slate-200 focus:bg-slate-300"
        placeholder={placeholder}
        onChange={onInputChange}
      />
    </div>
  );
};

export default Search;
