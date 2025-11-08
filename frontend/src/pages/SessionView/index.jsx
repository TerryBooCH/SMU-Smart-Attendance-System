import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import useSession from "../../hooks/useSession";
import useAttendance from "../../hooks/useAttendance";
import Header from "./Header";
import Toolbar from "./Toolbar";
import AttendanceContainer from "./AttendanceContainer";
import DownloadSessionReportForm from "./DownloadSessionReportForm";

const SessionView = () => {
  const { id } = useParams();
  const { selectedSession, fetchSessionById, loading, error } = useSession();
  const { attendances, fetchAttendanceBySessionId, loading: attendanceLoading, error: attendanceError } =
    useAttendance();

  useEffect(() => {
    if (id) {
      fetchSessionById(id);
      fetchAttendanceBySessionId(id);
    }
  }, [id]);
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20 ">
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Sessions", href: "/sessions" },
              { label: selectedSession?.courseName || "View Session" },
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
            <Header session={selectedSession} />
            <Toolbar session={selectedSession} />
            <DownloadSessionReportForm session={selectedSession} />
            <AttendanceContainer attendances={attendances} isLoading={attendanceLoading} />
        </div>
      </main>
    </div>
  );
};

export default SessionView;
