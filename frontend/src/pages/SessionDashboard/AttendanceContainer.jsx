import React, { useEffect } from "react";
import { CalendarCheck, AlertCircle, Loader2 } from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";
import { formatDateTime } from "../../utils/dateUtils";
import { getStatusConfig, getMethodBadge } from "../../utils/attendanceUtils";

const AttendanceContainer = ({ sessionId }) => {
  const {
    attendances,
    fetchAttendanceBySessionId,
    loading: attendanceLoading,
    error: attendanceError,
  } = useAttendance();

  useEffect(() => {
    if (sessionId) {
      fetchAttendanceBySessionId(sessionId);
    }
  }, [sessionId]);

  if (attendanceLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        <span>Loading attendance records...</span>
      </div>
    );
  }

  if (attendanceError) {
    return (
      <div className="flex items-center justify-center py-10 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Error: {attendanceError}</span>
      </div>
    );
  }

  if (!attendances?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-8 py-6 border-b border-slate-100">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
          <CalendarCheck className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Attendance Records</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {[
                "Name",
                "Status",
                "Method",
                "Confidence",
                "Student ID",
                "Class",
                "Course",
                "Email",
                "Phone",
                "Timestamp",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendances.map((record) => {
              const statusConfig = getStatusConfig(record.status);
              return (
                <tr
                  key={record.id}
                  className="hover:bg-slate-50 transition-colors duration-150"
                >
                  <td className="px-6 py-3 font-medium text-slate-900">
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
                    <span
                      className={`${getMethodBadge(
                        record.method
                      )} text-xs px-2.5 py-1 rounded font-medium border`}
                    >
                      {record.method}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.confidence !== undefined && record.confidence !== null
                      ? `${(record.confidence * 100).toFixed(0)}%`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.studentStudentId}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.studentClassName}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.sessionCourseName}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.studentEmail}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {record.studentPhone || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-slate-700">
                    {formatDateTime(record.timestamp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceContainer;
