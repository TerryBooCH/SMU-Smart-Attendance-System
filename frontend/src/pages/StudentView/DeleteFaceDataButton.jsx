import React from "react";
import { Trash2 } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import DeleteFaceDataForm from "./DeleteFaceDataForm";

const DeleteFaceDataButton = ({ faceData, student }) => {
  const { openModal } = useModal();

  const handleDeleteFaceData = (e) => {
    e.stopPropagation();
    openModal(<DeleteFaceDataForm faceData={faceData} student={student} />, "Delete Face Data", {
      width: "3xl",
      height: "auto",
    });
  };
  return (
    <button
      onClick={handleDeleteFaceData}
      className="cursor-pointer flex items-center gap-1.5 bg-red-500/80 hover:bg-red-500 text-white font-medium px-3 py-1.5 rounded-full shadow-sm transition"
    >
      <Trash2 size={16} />
      <span className="text-xs">Delete</span>
    </button>
  );
};

export default DeleteFaceDataButton;
