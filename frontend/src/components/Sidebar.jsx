import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import KeyboardShortcutsModalButton from "./KeyboardShortcutsModalButton";
import useSidebar from "../hooks/useSidebar";
import UserProfileContainer from "./UserProfileContainer";
import LogoutButton from "./LogoutButton";
import useAuth from "../hooks/useAuth";

import {
  Users,
  School,
  Video,
  FileText,
  Settings,
  House,
  PanelLeft,
  UsersRound,
  BarChart3,
} from "lucide-react";

const Sidebar = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed: isCollapsed, toggleCollapse } = useSidebar();

  // Default empty nav until user is loaded
  let navigationItems = [];

  if (user && !isLoading && user.perm !== undefined) {
    navigationItems =
      user.perm === 0
        ? [
            {
              path: "/summary",
              icon: BarChart3,
              label: "Summary",
              description: "Attendance overview",
              shortcut: "1",
            },
          ]
        : [
            {
              path: "/home",
              icon: House,
              label: "Home",
              description: "Dashboard overview",
              shortcut: "1",
            },
            {
              path: "/sessions",
              icon: School,
              label: "Sessions",
              description: "Manage classes",
              shortcut: "2",
            },
            {
              path: "/rosters",
              icon: UsersRound,
              label: "Rosters",
              description: "Roster management",
              shortcut: "3",
            },
            {
              path: "/live-recognition",
              icon: Video,
              label: "Live Recognition",
              description: "Real-time detection",
              shortcut: "4",
            },
            {
              path: "/students",
              icon: Users,
              label: "Students",
              description: "Student management",
              shortcut: "5",
            },
            {
              path: "/reports",
              icon: FileText,
              label: "Reports",
              description: "Analytics & exports",
              shortcut: "6",
            },
          ];
  }

  const isActive = (path) => {
    if (path === "/students") return location.pathname.startsWith("/student");
    if (path === "/rosters") return location.pathname.startsWith("/roster");
    if (path === "/sessions") return location.pathname.startsWith("/session");
    return location.pathname === path;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        const key = e.key;
        const item = navigationItems.find((item) => item.shortcut === key);

        if (item) {
          e.preventDefault();
          navigate(item.path);
        }

        if (key === "b" || key === "B") {
          e.preventDefault();
          toggleCollapse();
        }

        // Disable settings shortcut for students
        if (user?.perm !== 0 && key === ",") {
          e.preventDefault();
          navigate("/settings");
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, toggleCollapse, navigationItems, user?.perm]);

  if (isLoading) return null;

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
        <div className="px-4 py-2 border-b border-[#cecece] min-h-[5rem] flex items-center">
          <div className="group relative flex items-center rounded-xl transition-all duration-200 p-3 w-full">
            <div className="flex-shrink-0 w-6 flex items-center justify-center">
              <button
                onClick={toggleCollapse}
                className="flex items-center justify-center transition-all duration-300  -m-2 cursor-pointer"
                title="Toggle sidebar (Ctrl+B)"
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
                  onClick={toggleCollapse}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0 cursor-pointer"
                  title="Toggle sidebar (Ctrl+B)"
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
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span
                        className={`font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                          active
                            ? "text-white"
                            : "text-gray-900 group-hover:text-gray-900"
                        }`}
                      >
                        {item.label}
                      </span>
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
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <kbd
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border transition-colors duration-200 ${
                          active
                            ? "bg-white/20 border-white/30 text-white"
                            : "bg-gray-100 border-gray-300 text-gray-600"
                        }`}
                      >
                        CTRL + {item.shortcut}
                      </kbd>
                    </div>
                  </div>
                </div>
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

          {/* Hide Shortcuts & Settings for Students */}
          {user?.perm !== 0 && (
            <>
              <KeyboardShortcutsModalButton isCollapsed={isCollapsed} />
              <Link
                to="/settings"
                className={`group relative flex items-center rounded-xl transition-all duration-200 p-3 ${
                  isActive("/settings")
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
              >
                {isActive("/settings") && (
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full transition-all duration-300 ease-in-out ${
                      isCollapsed ? "opacity-0" : "opacity-100"
                    }`}
                  ></div>
                )}
                <div className="flex-shrink-0 w-6 flex justify-center">
                  <Settings
                    size={20}
                    strokeWidth={isActive("/settings") ? 2.5 : 2}
                    className={`transition-all duration-200 ${
                      isActive("/settings")
                        ? "text-white"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  />
                </div>
                <div
                  className={`flex-1 flex items-center justify-between ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
                    isCollapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
                  }`}
                >
                  <span
                    className={`font-medium text-sm whitespace-nowrap ${
                      isActive("/settings")
                        ? "text-white"
                        : "text-gray-900 group-hover:text-gray-900"
                    }`}
                  >
                    Settings
                  </span>
                  <kbd
                    className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border transition-colors duration-200 ${
                      isActive("/settings")
                        ? "bg-white/20 border-white/30 text-white"
                        : "bg-gray-100 border-gray-300 text-gray-600"
                    }`}
                  >
                    CTRL + ,
                  </kbd>
                </div>
              </Link>
            </>
          )}

          {/* Always show Logout & Profile */}
          <LogoutButton isCollapsed={isCollapsed} />
          <UserProfileContainer isCollapsed={isCollapsed} />
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
