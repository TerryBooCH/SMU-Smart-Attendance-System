import React from "react";
import CreateStudentButton from "./CreateStudentButton";
import BatchImportStudentsButton from "./BatchImportStudentsButton";
import SearchBar from "./SearchBar";


const Toolbar = () => {
  return (
    <div className="px-6 pt-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Students</h1>
        </div>
      <div className="mt-4">
        <SearchBar />
      </div>
        <div className="flex items-center gap-3">
          <BatchImportStudentsButton />
          <CreateStudentButton />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
