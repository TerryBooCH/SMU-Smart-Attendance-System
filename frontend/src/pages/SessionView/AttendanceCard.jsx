import React from "react";
import {
  Calendar,
  Mail,
  Phone,
  BookOpen,
  Users,
} from "lucide-react";
import UpdateStatusButton from "../../components/UpdateStatusButton";
import { formatDateTime } from "../../utils/dateUtils";
import { getStatusConfig, getMethodBadge } from "../../utils/attendanceUtils";

const AttendanceCard = ({ record, viewMode }) => {
  const statusConfig = getStatusConfig(record.status);
  const StatusIcon = statusConfig.icon;

  // Table row view
  if (viewMode === "table") {
    return (
      <tr key={record.id} className="hover:bg-slate-50 transition">
        <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-2">
          {record.studentName}
        </td>
        <td className="px-6 py-3">
          <span
            className={`${statusConfig.badgeBg} ${statusConfig.textColor} px-2.5 py-1 rounded text-xs font-semibold`}
          >
            {statusConfig.label}
          </span>
        </td>
        <td className="px-6 py-3">
          <span className={`${getMethodBadge(record.method)} text-xs px-2.5 py-1 rounded font-medium border`}>
            {record.method}
          </span>
        </td>
        <td className="px-6 py-3 text-slate-700">
          {record.confidence !== undefined && record.confidence !== null
            ? `${(record.confidence * 100).toFixed(0)}%`
            : "N/A"}
        </td>
        <td className="px-6 py-3 text-slate-700">{record.studentStudentId}</td>
        <td className="px-6 py-3 text-slate-700">{record.studentClassName}</td>
        <td className="px-6 py-3 text-slate-700">{record.sessionCourseName}</td>
        <td className="px-6 py-3 text-slate-700">{record.studentEmail}</td>
        <td className="px-6 py-3 text-slate-700">
          {record.studentPhone || "N/A"}
        </td>
        <td className="px-6 py-3 text-slate-700">
          {formatDateTime(record.timestamp)}
        </td>
        <td className="px-6 py-3 text-right">
          <UpdateStatusButton record={record} />
        </td>
      </tr>
    );
  }

  // Card view
  return (
    <div
      key={record.id}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${statusConfig.borderColor} border-t border-r border-b border-gray-200 hover:shadow-md transition-shadow`}
    >
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`${statusConfig.bgColor} p-2.5 rounded-lg flex-shrink-0`}
            >
              <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {record.studentName}
              </h3>
              <p className="text-sm text-gray-600">
                ID:{" "}
                <span className="font-medium text-gray-900">
                  {record.studentStudentId}
                </span>
              </p>
            </div>
          </div>
          <UpdateStatusButton record={record} />
        </div>

        {/* Status & Method Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`${statusConfig.badgeBg} ${statusConfig.textColor} px-3 py-1 rounded-full text-xs font-semibold`}
          >
            {statusConfig.label}
          </span>
          <span className={`${getMethodBadge(record.method)} text-xs px-2.5 py-1 rounded font-medium border`}>
            {record.method}
          </span>
        </div>

        {/* Timestamp & Confidence */}
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="font-medium">
              {formatDateTime(record.timestamp)}
            </span>
          </div>
          {record.confidence !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Confidence:</span>
              <span className="text-gray-900 font-semibold">
                {record.confidence !== null
                  ? `${(record.confidence * 100).toFixed(0)}%`
                  : "N/A"}
              </span>
            </div>
          )}
        </div>

        {/* Contact & Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-900 truncate">
                {record.studentEmail}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-1">Phone</p>
              <p className="text-sm text-gray-900">
                {record.studentPhone || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-1">Class</p>
              <p className="text-sm text-gray-900 truncate">
                {record.studentClassName}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-1">Course</p>
              <p className="text-sm text-gray-900 truncate">
                {record.sessionCourseName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;