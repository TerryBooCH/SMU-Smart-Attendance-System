import React from "react";
import Tooltip from "../../components/ToolTip";
import { Info } from "lucide-react";

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
          <div className="flex items-center gap-2 mb-2 ">
            <label className="block text-sm font-medium text-gray-600  ">
              ID Number
            </label>
            <div className="cursor-pointer">
              <Tooltip
                content="This is the unique ID number assigned to this student."
                position="right"
              >
                <Info size={16} />
              </Tooltip>
            </div>
          </div>

          <input
            type="text"
            value={student?.studentId || ""}
            disabled
            className="w-full px-4 py-2.5 border border-[#d4d4d4] rounded-xl bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none focus:ring-0"
          />
          <p className="text-xs text-gray-500 mt-2">
            This ID cannot be changed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentIdContainer;
