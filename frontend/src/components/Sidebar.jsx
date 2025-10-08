import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.svg";

import {
  Users,
  School,
  Video,
  FileText,
  Settings,
  LogOut,
  House,
  Sparkles,
  ChevronRight,
  PanelLeft,
  ArrowLeft,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      path: "/home",
      icon: House,
      label: "Home",
      description: "Dashboard overview",
    },
    {
      path: "/sessions",
      icon: School,
      label: "Sessions",
      description: "Manage classes",
    },
    {
      path: "/live-recognition",
      icon: Video,
      label: "Live Recognition",
      description: "Real-time detection",
    },
    {
      path: "/students",
      icon: Users,
      label: "Students",
      description: "Student management",
    },
    {
      path: "/reports",
      icon: FileText,
      label: "Reports",
      description: "Analytics & exports",
    },
  ];

  const isActive = (path) => {
    if (path === "/students") {
      return location.pathname.startsWith("/student");
    }
    return location.pathname === path;
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-72"
      } transition-all duration-300 ease-in-out flex-shrink-0`}
    >
      <nav
        className="fixed top-0 left-0 h-screen bg-white border-r border-[#cecece]  flex flex-col transition-all duration-300 ease-in-out"
        style={{ width: isCollapsed ? "80px" : "288px" }}
      >
        {/* Header / Logo section */}
        <div className="px-4 py-2 border-b border-[#cecece] min-h-[5rem] flex items-center
">
          <div className="group relative flex items-center rounded-xl transition-all duration-200 p-3 w-full" >
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center transition-all duration-300  -m-2 cursor-pointer"
              >
                <img src={Logo} alt="AgentSoC" className="size-[43px]" />
              </button>
            </div>
            <div
              className={`flex-1 min-w-0 ml-5 overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-lg transition-colors duration-200 whitespace-nowrap text-gray-900">
                    Smartend
                  </span>

                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0 cursor-pointer"
                >
                  <PanelLeft
                    size={20}
                    strokeWidth={2}
                    className="text-gray-600"
                  />
                </button>
              </div>
            </div>
            {isCollapsed && (
              <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Smartend
              </div>
            )}
          </div>
        </div>

        {/* Navigation section */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <div
            className={`px-2 py-1 mb-4 overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
            }`}
          >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Navigation
            </h3>
          </div>
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center rounded-xl transition-all duration-200 p-3 ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
              >
                {active && (
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full transition-all duration-300 ease-in-out ${
                      isCollapsed ? "opacity-0" : "opacity-100"
                    }`}
                  ></div>
                )}
                <div className="flex-shrink-0 w-6 flex items-center justify-center">
                  <IconComponent
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={`transition-all duration-200 ${
                      active
                        ? "text-white"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  />
                </div>
                <div
                  className={`flex-1 min-w-0 ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                        active
                          ? "text-white"
                          : "text-gray-900 group-hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <ChevronRight
                        size={16}
                        className="text-white opacity-60 flex-shrink-0"
                      />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 transition-colors duration-200 whitespace-nowrap ${
                      active
                        ? "text-blue-100"
                        : "text-gray-500 group-hover:text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
                {isCollapsed && (
                  <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Account section */}
        <div className="border-t border-[#cecece] p-4 space-y-2">
          <div
            className={`px-2 py-1 mb-2 overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
            }`}
          >
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Account
            </h3>
          </div>
          <Link
            to="/settings"
            className="group flex items-center rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-3"
          >
            <div className="flex-shrink-0 w-6 flex justify-center">
              <Settings
                size={20}
                strokeWidth={2}
                className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200"
              />
            </div>
            <span
              className={`font-medium text-sm ml-3 overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${
                isCollapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
              }`}
            >
              Settings
            </span>
          </Link>
          <button className="group cursor-pointer w-full flex items-center rounded-xl transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 p-3">
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

          <div
            className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
            }`}
          >
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-[#cecece]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    User Name
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
