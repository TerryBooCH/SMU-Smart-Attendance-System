import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const SettingsNavButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/settings")}
      className="
        size-11 flex items-center justify-center 
        rounded-full  text-gray-500 
        hover:bg-gray-200 hover:text-gray-700
        transition-colors duration-300 cursor-pointer
      "
      title="Settings"
    >
      <Settings size={24} />
    </button>
  );
};

export default SettingsNavButton;
