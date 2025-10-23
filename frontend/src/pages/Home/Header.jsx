import React from "react";
import TimeDateDisplay from "../../components/TimeDateDisplay";
import SettingsNavButton from "./SettingsNavButton";

const Header = () => {
  return (
    <div className="min-h-[5rem] flex items-center justify-end px-8">
      <div className="flex items-center gap-4 text-gray-600 text-medium">
        <TimeDateDisplay />
        <SettingsNavButton />
      </div>
    </div>
  );
};

export default Header;
