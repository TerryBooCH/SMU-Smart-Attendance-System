import React from "react";
import { X } from "lucide-react";

const LiveRecognitionSidebar = ({ activeSidebar, setActiveSidebar }) => {
  if (!activeSidebar) return null;

  const sidebarTitleMap = {
    info: "Information",
    notifications: "Notifications",
    attendance: "Attendance",
  };

  return (
    <div className="w-77 transition-all duration-300 ease-in-out flex-shrink-0">
      <nav className="fixed top-0 right-0 h-screen bg-white border-l border-[#cecece] flex flex-col w-77 ">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 min-h-[5rem]">
          <h2 className="text-lg font-semibold text-gray-800">
            {sidebarTitleMap[activeSidebar] || "Sidebar"}
          </h2>
          <button
            onClick={() => setActiveSidebar(null)} 
            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={23} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700">
          {activeSidebar === "info" && <p>Details and insights will appear here.</p>}
          {activeSidebar === "notifications" && <p>Your recent notifications.</p>}
          {activeSidebar === "attendance" && <p>Attendance information and controls.</p>}
        </div>
      </nav>
    </div>
  );
};

export default LiveRecognitionSidebar;
