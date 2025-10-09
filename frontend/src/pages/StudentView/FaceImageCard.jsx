import React from "react";

const FaceImageCard = ({ faceData }) => {
  const handleClick = () => {
    console.log("Open modal for:", faceData.studentName);
  };

  return (
    <div
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer w-[200px]"
      onClick={handleClick}
    >
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={faceData.imageBase64}
          alt={`Face data for ${faceData.studentName}`}
          className="w-4/5 h-4/5 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            className="text-white text-sm bg-black/60 px-3 py-1.5 rounded-full hover:bg-black/80 transition"
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering the card click
              console.log("View clicked for:", faceData.studentName);
            }}
          >
            View
          </button>
          <button
            className="text-white text-lg font-bold hover:text-red-400 transition"
            onClick={(e) => {
              e.stopPropagation(); // prevent triggering the card click
              console.log("Delete clicked for:", faceData.studentName);
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceImageCard;
