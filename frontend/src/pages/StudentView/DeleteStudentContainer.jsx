import React from "react";
import DeleteStudentButton from "./DeleteStudentButton";

const DeleteStudentContainer = ({ student }) => {
  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-900">Delete Student</h2>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-start gap-4">
          <p className="text-sm text-gray-600">
            Deleting a student is <span className="font-semibold text-red-600">permanent</span> and cannot be undone.
            Please confirm before proceeding.
          </p>
          <DeleteStudentButton student={student} />
        </div>
      </div>
    </div>
  );
};

export default DeleteStudentContainer;
