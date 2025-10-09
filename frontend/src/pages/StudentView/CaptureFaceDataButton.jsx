import React from "react";
import { useModal } from "../../hooks/useModal";
import { Camera } from "lucide-react";
import CaptureFaceDataForm from "./CaptureFaceDataForm";

const CaptureFaceDataButton = ({ student }) => {
  const { openModal } = useModal();

  const handleCaptureFaceData = () => {
    openModal(<CaptureFaceDataForm student={student} />, "Capture Face Data", {
      width: "4xl",
      height: "auto",
    });
  };
  return (
    <button
      type="button"
      onClick={handleCaptureFaceData}
      className="flex items-center gap-2 px-4 py-2 text-sm  font-medium text-white bg-black rounded-xl 
                 hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <Camera size={16} strokeWidth={1.8} />
      <span>Capture Face Data</span>
    </button>
  );
};

export default CaptureFaceDataButton;
