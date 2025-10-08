import React from "react";
import UploadFaceDataButton from "./UploadFaceDataButton";

const StudentFaceDataContainer = ({ student }) => {
  return (
    <div className="p-6">
      <div className="border-1 border-[#cecece] rounded-2xl">
        <div className="py-4 px-6  border-b border-[#cecece] flex items-center justify-between">
          <h2 className="font-semibold text-lg">Face Data</h2>
          <div>
            <UploadFaceDataButton student={student} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFaceDataContainer;
