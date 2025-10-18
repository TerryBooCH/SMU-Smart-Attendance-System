import React from "react";
import { Users, Calendar } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

const RosterHeader = ({ roster }) => {
  if (!roster) {
    return (
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 opacity-25">
          {/* Grid Pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Geometric Shapes */}
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/30 rounded-2xl rotate-12"></div>
          <div className="absolute bottom-10 right-20 w-24 h-24 border-2 border-white/20 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-20 h-20 border-2 border-white/25 rotate-45 rounded-md"></div>
          <div className="absolute bottom-1/4 right-1/3 w-16 h-16 border-2 border-white/25 -rotate-12 rounded-md"></div>
          <div className="absolute top-20 right-32 w-0 h-0 border-l-[25px] border-r-[25px] border-b-[40px] border-l-transparent border-r-transparent border-b-white/30 opacity-40 rotate-12"></div>
          <div className="absolute bottom-16 left-24 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-white/20 opacity-40 -rotate-6"></div>
          <div className="absolute top-1/2 left-10 w-16 h-8 bg-white/15 rotate-12 skew-x-12 rounded-md"></div>
          <div className="absolute bottom-1/3 right-10 w-20 h-10 bg-white/10 -rotate-12 skew-x-12 rounded-md"></div>
          <div className="absolute top-8 right-1/4 w-3 h-3 bg-white/40 rounded-full"></div>
          <div className="absolute bottom-12 left-1/3 w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/2 w-4 h-4 bg-white/30 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative mx-auto px-8 py-10">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/40 shadow-2xl hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
                <Users
                  className="relative w-10 h-10 text-white drop-shadow-lg"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-extrabold text-white mb-2 truncate tracking-tight drop-shadow-md">
                {roster.name}
              </h1>
              {roster.updatedAt && (
                <div className="text-white items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 inline-flex">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {formatDate(roster.createdAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
    </div>
  );
};

export default RosterHeader;
