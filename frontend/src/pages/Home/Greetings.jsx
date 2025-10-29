import React from "react";
import Logo from "../../assets/logo.svg";
import { getGreeting } from "../../utils/dateUtils";

const Greetings = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto pt-16 pb-12 px-8">
        <div className="flex items-center gap-3 mb-4">
          <img src={Logo} alt="AgentSoC" className="size-[43px]" />
          <span className="text-blue-600 font-bold text-lg">
            Smart Attendance
          </span>
        </div>

        <h1 className="text-6xl font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
          {getGreeting()}!
        </h1>
      </div>
    </div>
  );
};

export default Greetings;
