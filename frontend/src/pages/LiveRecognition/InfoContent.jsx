import React from "react";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  DoorOpen,
  DoorClosed,
  Info,
  Cpu,
  Eye,
  Target,
} from "lucide-react";
import { formatDateTime, calculateDuration } from "../../utils/dateUtils";
import { useConfigStore } from "../../store/configStore";

const InfoContent = ({ sessionData }) => {
  const { detector, recognizer, threshold, loading } = useConfigStore();

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">No session data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Session Status - Modern Card */}
      <div
        className={`relative overflow-hidden rounded-xl p-4 ${
          sessionData.open
            ? "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200"
            : "bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                sessionData.open ? "bg-emerald-100" : "bg-gray-100"
              }`}
            >
              {sessionData.open ? (
                <DoorOpen className="text-emerald-600" size={20} />
              ) : (
                <DoorClosed className="text-gray-500" size={20} />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-0.5">
                Session Status
              </p>
              <p
                className={`text-lg font-semibold ${
                  sessionData.open ? "text-emerald-600" : "text-gray-600"
                }`}
              >
                {sessionData.open ? "Open" : "Closed"}
              </p>
            </div>
          </div>
          <div
            className={`h-2 w-2 rounded-full ${
              sessionData.open ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
            }`}
          />
        </div>
      </div>

      {/* Course Information - Modern Grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Course Details
        </h3>
        <div className="grid gap-4">
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Calendar className="text-blue-600" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Course Name</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {sessionData.courseName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <Users className="text-purple-600" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Roster</p>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {sessionData.rosterName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Information - Modern Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Schedule
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Clock className="text-indigo-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Start Time</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDateTime(sessionData.startAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Clock className="text-indigo-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">End Time</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDateTime(sessionData.endAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <div className="p-2 bg-white rounded-lg">
              <Clock className="text-indigo-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Duration</p>
              <p className="text-sm font-bold text-gray-900">
                {calculateDuration(sessionData.startAt, sessionData.endAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Policy - Modern Alert */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Attendance Policy
        </h3>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertCircle className="text-orange-600" size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-0.5">Late Threshold</p>
            <p className="text-sm font-bold text-orange-700">
              {sessionData.lateAfterMinutes} minutes after start time
            </p>
          </div>
        </div>
      </div>

      {/* Model Configuration - Modern Tech Card */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Model Configuration
        </h3>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <p className="text-sm">Loading configuration...</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {/* Detector */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="p-1.5 bg-blue-50 rounded">
                <Cpu className="text-blue-600" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Detector</p>
                <p className="text-sm font-mono font-medium text-gray-900 truncate">
                  {detector}
                </p>
              </div>
            </div>

            {/* Recognizer */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="p-1.5 bg-blue-50 rounded">
                <Eye className="text-blue-600" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Recognizer</p>
                <p className="text-sm font-mono font-medium text-gray-900 truncate">
                  {recognizer}
                </p>
              </div>
            </div>

            {/* Threshold */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="p-1.5 bg-blue-50 rounded">
                <Target className="text-blue-600" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Recognition Threshold</p>
                <p className="text-sm font-mono font-medium text-gray-900">
                  {threshold}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata - Subtle Footer */}
      {(sessionData.createdAt || sessionData.updatedAt) && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Metadata
          </h3>
          <div className="space-y-1.5 text-xs text-gray-500">
            {sessionData.createdAt && (
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                Created: {formatDateTime(sessionData.createdAt)}
              </p>
            )}
            {sessionData.updatedAt && (
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                Last Updated: {formatDateTime(sessionData.updatedAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Closing Session Note - Modern Warning */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="p-2 bg-amber-100 rounded-lg h-fit">
            <Info className="text-amber-600" size={18} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-900 mb-1">
              Important Note
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Closing a session will automatically mark all students with a
              pending status as{" "}
              <span className="font-semibold text-gray-900 bg-white px-1.5 py-0.5 rounded">
                absent
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoContent;
