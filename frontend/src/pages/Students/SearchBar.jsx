import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import useStudent from "../../hooks/useStudent";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { searchStudentsByName, fetchAllStudents } = useStudent();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchValue.trim()) {
        searchStudentsByName(searchValue.trim());
      } else {
        fetchAllStudents();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchValue]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleClear = () => {
    setSearchValue("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" />
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search students..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-12 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-100 p-1 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
