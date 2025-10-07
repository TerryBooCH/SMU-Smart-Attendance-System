import React from "react";
import { CirclePlus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import CreateStudentForm from "./CreateStudentForm";

const CreateStudentButton = () => {
  const { openModal } = useModal();

  const handleCreateStudent = () => {
    // Open the modal with DeleteChatForm component
    openModal(<CreateStudentForm  />, "Create Student");
  };

  return (
    <button
      className={`text-white bg-primary gap-3 py-2.5 px-4 flex items-center justify-center rounded-xl cursor-pointer`}
      onClick={handleCreateStudent}
    >
      <CirclePlus size={23} strokeWidth={1.2} />
      Enroll
    </button>
  );
};

export default CreateStudentButton;
