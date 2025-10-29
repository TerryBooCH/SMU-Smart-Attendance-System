import React from "react";
import { Calendar, Clock, Timer } from "lucide-react";
import { formatTime, formatDate, isSameDay } from "../../utils/dateUtils";

const Header = ({ session }) => {
  const sameDay = isSameDay(session?.startAt, session?.endAt);

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
          <div className="flex items-center justify-between gap-6 flex-wrap">
            {/* Left: Course Info with Icon */}
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/40 shadow-2xl hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
                  <Calendar
                    className="relative w-10 h-10 text-white drop-shadow-lg"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-extrabold text-white truncate tracking-tight drop-shadow-md">
                    {session?.courseName || "Course"}
                  </h1>
                  {session?.open ? (
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-400 text-emerald-950 text-sm font-bold rounded-full shadow-lg flex items-center gap-2 border-2 border-emerald-300">
                      <div className="w-2 h-2 bg-emerald-950 rounded-full animate-pulse shadow-sm"></div>
                      OPEN
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2 border-2 border-red-400">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      CLOSED
                    </span>
                  )}
                </div>
                <p className="text-white/90 text-lg font-medium mb-3">
                  {session?.rosterName || "Session"}
                </p>
              </div>
            </div>

            {/* Right: Time Cards */}
            <div className="flex gap-3 flex-wrap">
              {/* Start */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-emerald-300" />
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    Start
                  </p>
                </div>
                <p className="text-white text-xl font-bold mb-0.5">
                  {formatTime(session?.startAt)}
                </p>
                <p className="text-white/70 text-sm">
                  {formatDate(session?.startAt)}
                </p>
              </div>

              {/* End */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-rose-300" />
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    End
                  </p>
                </div>
                <p className="text-white text-xl font-bold mb-0.5">
                  {formatTime(session?.endAt)}
                </p>
                <p className="text-white/70 text-sm">
                  {sameDay ? "Same day" : formatDate(session?.endAt)}
                </p>
              </div>

              {/* Late After */}
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="w-4 h-4 text-amber-300" />
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                    Late After
                  </p>
                </div>
                <p className="text-white text-xl font-bold mb-0.5">
                  {session?.lateAfterMinutes || 0} mins
                </p>
                <p className="text-white/70 text-sm">Grace period</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
      </div>
    </div>
  );
};

export default Header;
