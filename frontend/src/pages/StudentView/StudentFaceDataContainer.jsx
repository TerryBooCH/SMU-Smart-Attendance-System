import React from "react";
import UploadFaceDataButton from "./UploadFaceDataButton";

const StudentFaceDataContainer = ({ student }) => {
  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-800">Face Data</h2>
          <UploadFaceDataButton student={student} />
        </div>

        {/* Content (future image section placeholder) */}
        <div className="p-6">
          <div className="flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#d4d4d4] rounded-xl py-12 bg-gray-50/50">
            <p className="text-sm font-lexend text-gray-600">
              No face data uploaded yet.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Uploaded face data will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFaceDataContainer;
