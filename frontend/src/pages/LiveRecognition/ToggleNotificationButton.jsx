import React from "react";
import { Bell } from "lucide-react";

const ToggleNotificationButton = ({ activeSidebar, setActiveSidebar }) => {
  const isActive = activeSidebar === "notifications";

  const handleClick = () => {
    setActiveSidebar(isActive ? null : "notifications");
  };

  return (
    <button
      onClick={handleClick}
      className={`
        size-11 flex items-center justify-center 
        rounded-full transition-colors duration-300 cursor-pointer
        ${isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"}
      `}
      title="Notifications"
    >
      <Bell size={22} />
    </button>
  );
};

export default ToggleNotificationButton;
