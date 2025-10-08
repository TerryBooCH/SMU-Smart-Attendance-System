import React from "react";

const StudentIdContainer = ({ student }) => {
  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-800">Student ID</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            ID Number
          </label>
          <input
            type="text"
            value={student?.studentId || ""}
            disabled
            className="w-full px-4 py-2.5 border border-[#d4d4d4] rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none focus:ring-0"
          />
          <p className="text-xs text-gray-500 mt-2">
            This ID  cannot be changed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentIdContainer;
