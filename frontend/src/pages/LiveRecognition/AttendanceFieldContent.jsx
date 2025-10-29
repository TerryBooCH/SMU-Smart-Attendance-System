import React from "react";
import UpdateStatusButton from "../../components/UpdateStatusButton";
import { getStatusConfig, getMethodBadge } from "../../utils/attendanceUtils";

const AttendanceFieldContent = ({ attendances, loading, error }) => {
  if (loading) {
    return (
      <div className="p-3 text-center">
        <p className="text-xs text-gray-500">Loading attendance...</p>
      </div>
    );
  }

  if (!attendances?.length) {
    return (
      <div className="p-3 text-center">
        <p className="text-xs text-gray-400">No attendance records</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[400px]">
      <div className="space-y-2">
        {attendances.map((record) => {
          const statusConfig = getStatusConfig(record.status);
          const StatusIcon = statusConfig.icon;
          const methodBadge = getMethodBadge(record.method);

          return (
            <div
              key={record.id}
              className={`bg-white rounded-lg border-l-4 ${statusConfig.borderColor} border-t border-r border-b border-gray-200 hover:shadow-md transition-shadow`}
            >
              <div className="p-2.5">
                {/* Header: Icon + Name + Status Button */}
                <div className="flex items-start gap-2 mb-2">
                  <div
                    className={`${statusConfig.bgColor} p-1.5 rounded-lg flex-shrink-0`}
                  >
                    <StatusIcon
                      className={`w-3.5 h-3.5 ${statusConfig.iconColor}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-gray-900 truncate leading-tight">
                      {record.studentName}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {record.studentStudentId}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <UpdateStatusButton record={record} />
                  </div>
                </div>

                {/* Details Row */}
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-700">
                      {new Date(record.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span
                      className={`${methodBadge} px-1.5 py-0.5 rounded text-[9px] font-medium border`}
                    >
                      {record.method}
                    </span>
                  </div>
                  {record.confidence && (
                    <span className="text-gray-600 font-semibold">
                      {(record.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceFieldContent;
