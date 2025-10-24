import React from "react";
import { PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useSession from "../hooks/useSession";
import useToast from "../hooks/useToast";

const OpenSessionButton = ({ session }) => {
  if (!session) return null;

  const { openSession } = useSession();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const updatedSession = await openSession(session.id);
      success(`"${updatedSession.courseName || session.courseName}" opened successfully!`);

      navigate(`/session/${session.id}/live-recognition`);
    } catch (err) {
      console.error("Error opening session:", err);
      error(`Failed to open session: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      title={`Open ${session.courseName || "Session"}`}
    >
      <PlayCircle size={16} />
      <span>Open</span>
    </button>
  );
};

export default OpenSessionButton;
