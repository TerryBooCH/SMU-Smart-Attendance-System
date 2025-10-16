import React from "react";
import { useModal } from "../hooks/useModal";
import { Edit } from "lucide-react";
import UpdateRosterForm from "./UpdateRosterForm";

const UpdateRosterButton = ({ roster }) => {
  const { openModal } = useModal();
  const handleUpdateRoster = () => {
    openModal(<UpdateRosterForm roster={roster} />, "Update Roster");
  };
  return (
    <button
      onClick={handleUpdateRoster}
      className="flex items-center cursor-pointer px-2 py-2 text-black"
    >
      <Edit size={16} />
    </button>
  );
};

export default UpdateRosterButton;
