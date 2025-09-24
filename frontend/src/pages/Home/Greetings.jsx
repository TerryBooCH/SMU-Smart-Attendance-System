import React from "react";
import { Sparkles } from "lucide-react";

const Greetings = () => {
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto pt-16 pb-12 px-8">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-blue-600" size={32} />
          <span className="text-blue-600 font-bold text-lg ">
            Smart Attendance
          </span>
        </div>

        <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4 leading-tight">
          {getGreeting()}!
        </h1>

        <div className="flex items-center gap-6 mt-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span class="relative flex size-3">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex size-3 rounded-full bg-green-500"></span>
            </span>
            System Online
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Greetings;
