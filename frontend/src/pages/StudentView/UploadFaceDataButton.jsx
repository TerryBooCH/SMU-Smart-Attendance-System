import React from "react";
import { UploadCloud } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import UploadFaceDataForm from "./UploadFaceDataForm";

const UploadFaceDataButton = ({ student }) => {
  const { openModal } = useModal();
  const handleUploadFaceData = () => {
    openModal(<UploadFaceDataForm student={student} />, "Update Face Data", { width: "2xl", height: "auto" });
  };
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl  hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      onClick={handleUploadFaceData}
    >
      <UploadCloud size={18} />
      <span className="font-medium">Upload Face Data</span>
    </button>
  );
};

export default UploadFaceDataButton;
