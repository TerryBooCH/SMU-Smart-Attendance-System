import React, { useState, useEffect, useCallback } from "react";
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
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search by student by name..."
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
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
