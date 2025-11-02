import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import { formatDateTime } from "../../utils/dateUtils";
import NavigateToSessionDashboardButton from "./NavigateToSessionDashboardButton";

const SessionContainer = () => {
  const { sessions, loading, error, fetchAllSessions } = useSession();
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const history = navigate; // alias for clarity if you want to pass it around

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAllSessions();
      hasFetched.current = true;
    }
  }, [fetchAllSessions]);

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading sessions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roster Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late After (mins)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {sessions && sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {session.courseName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {session.rosterName || "Unnamed Roster"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDateTime(session.startAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {formatDateTime(session.endAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {session.lateAfterMinutes ?? "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          session.open
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {session.open ? "Open" : "Closed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(session.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDateTime(session.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <NavigateToSessionDashboardButton session={session} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionContainer;
