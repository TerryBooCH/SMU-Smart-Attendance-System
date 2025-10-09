import React from "react";
import UploadFaceDataButton from "./UploadFaceDataButton";
import CaptureFaceDataButton from "./CaptureFaceDataButton";
import Tooltip from "../../components/ToolTip";
import FaceImageCard from "./FaceImageCard";
import { Info } from "lucide-react";

const StudentFaceDataContainer = ({ student, faceData, loading }) => {
  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg text-gray-800">Face Data</h2>
            <div className="cursor-pointer">
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
          {loading ? (
            <div className="flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#d4d4d4] rounded-xl py-12 bg-gray-50/50">
              <p className="text-sm font-lexend text-gray-600">Loading...</p>
            </div>
          ) : faceData && faceData.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 justify-center">
              {faceData.map((data) => (
                <FaceImageCard key={data.id} faceData={data} />
              ))}
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
