import React from "react";
import { formatDateTime, calculateDuration } from "../../utils/dateUtils";

const getStatusBadge = (status) => {
  const styles = {
    PRESENT: "bg-green-100 text-green-700",
    LATE: "bg-orange-100 text-orange-700",
    ABSENT: "bg-red-100 text-red-700",
    PENDING: "bg-purple-100 text-purple-700",
  };
  return styles[status] || styles.PENDING;
};

const SessionTable = ({ sessions }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-100">
      <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            {[
              "Session ID",
              "Course Name",
              "Roster Name",
              "Start Time",
              "End Time",
              "Duration",
              "Late After",
              "Arrival Offset",
              "Method",
              "Confidence",
              "Timestamp",
              "Status",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-gray-600 font-semibold uppercase text-xs tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sessions.map((s) => {
            const duration = calculateDuration(s.startAt, s.endAt);
            const startAt = formatDateTime(s.startAt);
            const endAt = formatDateTime(s.endAt);
            const timestamp = formatDateTime(s.timestamp);

            let arrival;
            if (s.arrivalOffsetMinutes === 0) {
              arrival = "On Time";
            } else if (s.arrivalOffsetMinutes > 0) {
              arrival = `${s.arrivalOffsetMinutes} min late`;
            } else {
              arrival = `${Math.abs(s.arrivalOffsetMinutes)} min early`;
            }

            const badge = getStatusBadge(s.status);
            return (
              <tr key={s.sessionId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{s.sessionId}</td>
                <td className="px-6 py-4">{s.courseName}</td>
                <td className="px-6 py-4 text-gray-600">{s.rosterName}</td>
                <td className="px-6 py-4 text-gray-600">{startAt}</td>
                <td className="px-6 py-4 text-gray-600">{endAt}</td>
                <td className="px-6 py-4 text-gray-600">{duration}</td>
                <td className="px-6 py-4 text-gray-600">{s.lateAfterMinutes} min</td>
                <td className="px-6 py-4 text-gray-600">{arrival}</td>
                <td className="px-6 py-4 text-gray-600">{s.method}</td>
                <td className="px-6 py-4 text-gray-600">
                  {(s.confidence * 100).toFixed(0)}%
                </td>
                <td className="px-6 py-4 text-gray-600">{timestamp}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${badge}`}
                  >
                    {s.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default SessionTable;
