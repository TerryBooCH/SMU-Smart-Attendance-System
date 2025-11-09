import React from "react";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavToDashboardButton = ({ session }) => {
  const navigate = useNavigate();

  if (!session) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-3 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded-lg cursor-not-allowed"
        title="Loading session..."
      >
        <LayoutDashboard size={16} />
        <span>Loading...</span>
      </button>
    );
  }

  const handleClick = () => {
    navigate(`/session/${session.id}/dashboard`);
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      title={`Go to ${session.courseName || "session"} dashboard`}
    >
      <LayoutDashboard size={16} />
      <span>Dashboard</span>
    </button>
  );
};

export default NavToDashboardButton;
