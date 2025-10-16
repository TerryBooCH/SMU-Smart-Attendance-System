import React from "react";

const FaceDataDetailsModal = ({ faceData }) => {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Image Section */}
      <div className="w-full max-w-md aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
        <img
          src={faceData.imageBase64}
          alt={`Face data for ${faceData.studentName}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Details Section */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{faceData.studentName}</h3>
        <div className="flex flex-col gap-3 text-sm text-gray-700">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="font-medium text-gray-600">Student ID</span>
            <span className="text-gray-800">{faceData.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Created At</span>
            <span className="text-gray-800">
              {new Date(faceData.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceDataDetailsModal;
