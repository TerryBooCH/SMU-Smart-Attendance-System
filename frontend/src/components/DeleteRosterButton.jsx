import React from 'react'
import { useModal } from "../hooks/useModal";
import { Trash2 } from "lucide-react";
import DeleteRosterForm from './DeleteRosterForm';

const DeleteRosterButton = ({ roster }) => {
  const { openModal } = useModal();
  const handleDeleteRoster = () => {
    openModal(<DeleteRosterForm roster={roster} />, "Delete Roster?");
  };
  return (
    <button
      onClick={handleDeleteRoster}
      className="flex items-center cursor-pointer   px-2 py-2 text-red-500"
    >
      <Trash2 size={16} />
    </button>
  );
}

export default DeleteRosterButton
