import React from "react";
import { useModal } from "../hooks/useModal";
import { Trash2 } from "lucide-react";
import DeleteSessionForm from "./DeleteSessionForm";

const DeleteSessionButton = ({ session }) => {
  const { openModal } = useModal();
  const handleDeleteSession = () => {
    openModal(<DeleteSessionForm session={session} />, "Delete Session?");
  };
  return (
    <button
      onClick={handleDeleteSession}
      className="flex items-center cursor-pointer   px-2 py-2 text-red-500"
    >
      <Trash2 size={16} />
    </button>
  );
};

export default DeleteSessionButton;
