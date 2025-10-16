import React from "react";
import useAuth from "../hooks/useAuth";
import { getInitials } from "../utils/stringUtils";

const UserProfileContainer = ({ isCollapsed }) => {
  const { user } = useAuth();

  const getRoleLabel = (permissionLevel) => {
    switch (String(permissionLevel)) {
      case "0":
        return "Student";
      case "1":
        return "Teaching Assistant";
      case "2":
        return "Professor";
      default:
        return permissionLevel;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
        isCollapsed ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
      }`}
    >
      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-[#cecece]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {getRoleLabel(user.perm ?? user.permissionLevel)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileContainer;
