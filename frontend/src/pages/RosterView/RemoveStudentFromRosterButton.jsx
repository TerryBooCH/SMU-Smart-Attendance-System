import React from "react";
import { UserRoundX } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import RemoveStudentFromRosterForm from "./RemoveStudentFromRosterForm";

const RemoveStudentFromRosterButton = ({ student, roster }) => {
  const { openModal } = useModal();
  const handleRemoveStudent = () => {
    openModal(
      <RemoveStudentFromRosterForm student={student} roster={roster} />,
      "Remove Student?"
    );
  };
  return (
    <button
      onClick={handleRemoveStudent}
      title="Remove Student"
      className="flex items-center justify-center p-2 text-red-600 rounded-md 
                 hover:bg-gray-100  
                 transition-colors duration-200 cursor-pointer"
    >
      <UserRoundX size={16} />
    </button>
  );
};

export default RemoveStudentFromRosterButton;
