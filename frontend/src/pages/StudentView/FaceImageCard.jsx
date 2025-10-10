import React from "react";
import { Eye, Trash2 } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import FaceDataDetailsModal from "./FaceDataDetailsModal";
import DeleteFaceDataButton from "./DeleteFaceDataButton";

const FaceImageCard = ({ faceData, student }) => {
  const { openModal } = useModal();
  const handleView = () => {
    openModal(
      <FaceDataDetailsModal faceData={faceData} />,
      "Face Data For " + faceData.studentName,
      { width: "3xl", height: "auto" }
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer w-[200px] p-2"
      onClick={handleView}
    >
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl">
        <img
          src={faceData.imageBase64}
          alt={`Face data for ${faceData.studentName}`}
          className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {/* View button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView();
            }}
            className="cursor-pointer flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 font-medium px-3 py-1.5 rounded-full shadow-sm transition"
          >
            <Eye size={16} />
            <span className="text-xs">View</span>
          </button>

          {/* Delete button */}
          <DeleteFaceDataButton faceData={faceData} student={student} />
        </div>
      </div>
    </div>
  );
};

export default FaceImageCard;
