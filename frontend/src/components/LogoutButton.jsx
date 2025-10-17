import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LogoutButton = ({ isCollapsed }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="group cursor-pointer w-full flex items-center rounded-xl transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 p-3"
    >
      <div className="flex-shrink-0 w-6 flex justify-center">
        <LogOut
          size={20}
          strokeWidth={2}
          className="transition-colors duration-200"
        />
      </div>
      <span
        className={`font-medium text-sm ml-3 overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${
          isCollapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
        }`}
      >
        Log Out
      </span>
    </button>
  );
};

export default LogoutButton;
