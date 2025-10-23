import React from "react";
import { ClipboardList } from "lucide-react";

const ToggleAttendanceFieldButton = ({ activeSidebar, setActiveSidebar }) => {
  const isActive = activeSidebar === "attendance";

  const handleClick = () => {
    setActiveSidebar(isActive ? null : "attendance");
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
      title="Attendance Field"
    >
      <ClipboardList size={22} />
    </button>
  );
};

export default ToggleAttendanceFieldButton;
