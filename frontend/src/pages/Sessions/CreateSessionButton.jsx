import React from "react";
import { CirclePlus } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import CreateSessionForm from "./CreateSessionForm";

const CreateSessionButton = () => {
  const { openModal } = useModal();

  const handleCreateSession = () => {
    openModal(<CreateSessionForm />, "Create Session");
  };
  return (
    <button
      onClick={handleCreateSession}
      className="flex items-center gap-2 px-4 py-2 text-sm font-lexend font-medium text-white 
                 bg-primary rounded-xl transition-all duration-200 
                 hover:bg-primary/90 active:scale-[0.98] 
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <CirclePlus size={18} strokeWidth={1.8} />
      <span>Create Session</span>
    </button>
  );
};

export default CreateSessionButton;
