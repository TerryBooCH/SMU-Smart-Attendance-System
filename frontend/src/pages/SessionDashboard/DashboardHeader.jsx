
import React from "react";
import { Calendar, Clock, Users, BookOpen } from "lucide-react";
import { formatTime, formatDate, isSameDay } from "../../utils/dateUtils";

const DashboardHeader = ({ session }) => {
  if (!session) {
    return (
      <div className="p-4 bg-white rounded-xl text-gray-400 text-sm border border-gray-200 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
        Loading session details...
      </div>
    );
  }

  const sameDay = isSameDay(session.startAt, session.endAt);
  const formattedDate = formatDate(session.startAt);
  const formattedStartTime = formatTime(session.startAt);
  const formattedEndTime = formatTime(session.endAt);

  return (
    <div className="bg-white   overflow-hidden">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Course Info */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <BookOpen size={26} className="text-white" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-sm"></div>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                {session.courseName || "Unknown Course"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 font-medium whitespace-nowrap">
                {session.rosterName || "No roster info"}
              </p>
            </div>
          </div>

          {/* Right: Info Cards */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-blue-600" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">Start</span>
                <span className="text-xs text-gray-600 font-medium">
                  {formattedDate} {formattedStartTime}
                </span>
              </div>
            </div>

            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-blue-600" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">End</span>
                <span className="text-xs text-gray-600 font-medium">
                  {sameDay ? `Same day ${formattedEndTime}` : `${formatDate(session.endAt)} ${formattedEndTime}`}
                </span>
              </div>
            </div>

            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-amber-600" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">Grace Period</span>
                <span className="text-xs text-gray-600 font-medium">{session.lateAfterMinutes} minutes</span>
              </div>
            </div>

            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-purple-600" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">Roster</span>
                <span className="text-xs text-gray-600 font-medium">{session.rosterName}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;