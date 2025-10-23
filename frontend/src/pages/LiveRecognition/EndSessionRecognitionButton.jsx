import React from "react";
import { useNavigate } from "react-router-dom";
import { Power } from "lucide-react";

const EndSessionRecognitionButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/sessions");
  };

  return (
    <button
      title="End Session"
      onClick={handleClick}
      className="flex items-center py-3 px-5 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium shadow-md transition-all active:scale-95 cursor-pointer"
    >
      <Power className="size-7" />
    </button>
  );
};

export default EndSessionRecognitionButton;
