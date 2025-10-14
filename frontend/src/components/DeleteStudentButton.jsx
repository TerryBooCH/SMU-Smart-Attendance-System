import React from "react";
import { useModal } from "../hooks/useModal";
import { Trash2 } from "lucide-react";
import DeleteStudentForm from "./DeleteStudentForm";

const DeleteStudentButton = ({ student }) => {
  const { openModal } = useModal();
  const handleDeleteStudent = () => {
    openModal(<DeleteStudentForm student={student} />, "Delete Student?");
  };
  return (
    <button
      onClick={handleDeleteStudent}
      className="flex items-center cursor-pointer   px-2 py-2 text-red-500"
    >
      <Trash2 size={16} />
    </button>
  );
};

export default DeleteStudentButton;
