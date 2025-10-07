import React from 'react'
import { useModal } from "../hooks/useModal";
import { Edit } from 'lucide-react';
import UpdateStudentForm from './UpdateStudentForm';

const UpdateStudentButton = ({student}) => {
  const { openModal } = useModal();
  const handleUpdateStudent = () => {
    openModal(<UpdateStudentForm student={student} />, "Update Student");
  };
  return (
    <button
      onClick={handleUpdateStudent}
      className="flex items-center cursor-pointer px-2 py-2 text-black"
    >
      <Edit size={16} />
    </button>
  )
}

export default UpdateStudentButton
