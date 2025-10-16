import React from "react";
import UploadFaceDataButton from "./UploadFaceDataButton";
import CaptureFaceDataButton from "./CaptureFaceDataButton";
import Tooltip from "../../components/ToolTip";
import FaceImageCard from "./FaceImageCard";
import { Info } from "lucide-react";

const StudentFaceDataContainer = ({ student, faceData, loading }) => {
  const faceCount = faceData?.length || 0;
  const isFull = faceCount >= 20;
  const hasImages = faceData && faceData.length > 0;

  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              Face Data
              <span
                className={`text-sm font-medium px-2 py-0.5 rounded-full border transition-colors duration-300 ${
                  isFull
                    ? "bg-red-100 text-red-600 border-red-200"
                    : "bg-green-100 text-green-600 border-green-200"
                }`}
              >
                {faceCount}/20
              </span>
            </h2>

            <div className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors">
              <Tooltip
                content="You can upload a maximum of 20 faces for recognition."
                position="right"
              >
                <Info size={16} />
              </Tooltip>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <CaptureFaceDataButton student={student} />
            <UploadFaceDataButton student={student} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {hasImages ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 justify-center">
              {faceData.map((data) => (
                <FaceImageCard
                  key={data.id}
                  faceData={data}
                  student={student}
                />
              ))}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#d4d4d4] rounded-xl py-12 bg-gray-50/50">
              <p className="text-sm font-lexend text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#d4d4d4] rounded-xl py-12 bg-gray-50/50">
              <p className="text-sm font-lexend text-gray-600">
                No face data uploaded yet.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Uploaded face data will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFaceDataContainer;
