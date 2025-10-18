import React from "react";
import { CirclePlus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import AddStudentToRosterForm from "./AddStudentToRosterForm";

const AddStudentToRosterButton = ({ roster }) => {
  const { openModal } = useModal();

  const handleAddStudentToRoster = () => {
    openModal(<AddStudentToRosterForm roster={roster} />, "Add Student to Roster", {
      width: "xl",
      height: "auto",
    });
  };

  return (
    <button
      type="button"
      onClick={handleAddStudentToRoster}
      className="flex items-center gap-2 px-4 py-2 text-sm  font-medium text-white bg-black rounded-xl 
                 hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <CirclePlus size={16} strokeWidth={1.8} />
      <span>Add Student</span>
    </button>
  );
};

export default AddStudentToRosterButton;
