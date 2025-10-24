import React from "react";
import { useNavigate } from "react-router-dom";
import { Power } from "lucide-react";
import useToast from "../../hooks/useToast";
import useSession from "../../hooks/useSession";

const EndSessionRecognitionButton = ({ id }) => {
  const navigate = useNavigate();
  const { closeSession } = useSession();
  const { success, error } = useToast();

  const handleClick = async () => {
    if (!id) {
      error("No session ID provided.");
      return;
    }

    try {
      await closeSession(id);
      success("Session closed successfully.");
      navigate("/sessions");
    } catch (err) {
      console.error("Error closing session:", err);
      error(`Failed to close session: ${err.message || "Unknown error"}`);
    }
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
