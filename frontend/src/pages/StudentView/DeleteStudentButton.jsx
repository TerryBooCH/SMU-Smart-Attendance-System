import React from "react";
import { Trash2 } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import DeleteStudentForm from "../../components/DeleteStudentForm";

const DeleteStudentButton = ({ student }) => {
  const { openModal } = useModal();

  const handleDeleteStudent = () => {
    openModal(
      <DeleteStudentForm student={student} />,
      "Delete Student",
      { width: "lg", height: "auto" }
    );
  };

  return (
    <button
      type="button"
      onClick={handleDeleteStudent}
      className="flex items-center justify-center gap-2  px-4 py-2 text-sm bg-red-600 text-white rounded-xl font-lexend hover:bg-red-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      <Trash2 size={18} strokeWidth={1.6} />
      <span className="font-medium">Delete</span>
    </button>
  );
};

export default DeleteStudentButton;
