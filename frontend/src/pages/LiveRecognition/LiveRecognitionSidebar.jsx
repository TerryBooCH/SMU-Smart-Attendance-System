import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import InfoContent from "./InfoContent";
import NotificationContent from "./NotificationContent";
import AttendanceFieldContent from "./AttendanceFieldContent";
import useSession from "../../hooks/useSession";
import useAttendance from "../../hooks/useAttendance";

const LiveRecognitionSidebar = ({ id, activeSidebar, setActiveSidebar }) => {
  const { fetchSessionById, loading: sessionLoading, error: sessionError } = useSession();
  const {
    attendances,
    fetchAttendanceBySessionId,
    loading: attendanceLoading,
    error: attendanceError,
  } = useAttendance();

  const [sessionData, setSessionData] = useState(null);
  const hasFetchedSession = useRef(false);
  const hasFetchedAttendance = useRef(false);

  // Fetch session info (when sidebar is info)
  useEffect(() => {
    if (activeSidebar === "info" && id && !hasFetchedSession.current) {
      hasFetchedSession.current = true;
      fetchSessionById(id)
        .then((data) => {
          setSessionData(data);
        })
        .catch((err) => {
          console.error("Failed to fetch session:", err);
          hasFetchedSession.current = false; // allow retry
        });
    }
  }, [activeSidebar, id]);

  // Fetch attendance (when sidebar is attendance)
  useEffect(() => {
    if (activeSidebar === "attendance" && id && !hasFetchedAttendance.current) {
      hasFetchedAttendance.current = true;
      fetchAttendanceBySessionId(id).catch((err) => {
        console.error("Failed to fetch attendance:", err);
        hasFetchedAttendance.current = false; // allow retry
      });
    }
  }, [activeSidebar, id]);

  if (!activeSidebar) return null;

  const sidebarTitleMap = {
    info: "Information",
    notifications: "Notifications",
    attendance: "Attendance",
  };

  return (
    <div className="w-77 transition-all duration-300 ease-in-out flex-shrink-0">
      <nav className="fixed top-0 right-0 h-screen bg-white border-l border-[#cecece] flex flex-col w-77">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 min-h-[5rem]">
          <h2 className="text-lg font-semibold text-gray-800">
            {sidebarTitleMap[activeSidebar] || "Sidebar"}
          </h2>
          <button
            onClick={() => setActiveSidebar(null)}
            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={23} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-700">
          {activeSidebar === "info" && (
            <>
              {sessionLoading && <p>Loading session data...</p>}
              {sessionError && <p className="text-red-500">Error: {sessionError}</p>}
              {!sessionLoading && !sessionError && sessionData && (
                <InfoContent sessionData={sessionData} />
              )}
              {!sessionLoading && !sessionError && !sessionData && (
                <p>No session data available.</p>
              )}
            </>
          )}

          {activeSidebar === "notifications" && <NotificationContent />}

          {activeSidebar === "attendance" && (
            <AttendanceFieldContent
              attendances={attendances}
              isLoading={attendanceLoading}
              error={attendanceError}
            />
          )}
        </div>
      </nav>
    </div>
  );
};

export default LiveRecognitionSidebar;
