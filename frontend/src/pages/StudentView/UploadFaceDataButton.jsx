import React from "react";
import { UploadCloud } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import UploadFaceDataForm from "./UploadFaceDataForm";

const UploadFaceDataButton = ({ student }) => {
  const { openModal } = useModal();

  const handleUploadFaceData = () => {
    openModal(<UploadFaceDataForm student={student} />, "Update Face Data", {
      width: "3xl",
      height: "auto",
    });
  };

  return (
    <button
      type="button"
      onClick={handleUploadFaceData}
      className="flex items-center gap-2 px-4 py-2 text-sm  font-medium text-white bg-black rounded-xl 
                 hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <UploadCloud size={16} strokeWidth={1.8} />
      <span>Upload Face Data</span>
    </button>
  );
};

export default UploadFaceDataButton;
