import React from "react";
import { CalendarClock } from "lucide-react";
import DownloadSessionReportButton from "../../components/DownloadSessionReportButton";

const DownloadSessionReportContainer = ({ session }) => {
  return (
    <div className="p-6 bg-white w-full border-t border-gray-200">
      {/* Header: session info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-2xl">
            <CalendarClock size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 font-lexend">
              Download report for {session?.courseName || "Session"}
            </h3>
            {session?.title && (
              <p className="text-sm text-gray-500 font-lexend">
                {session.title}
              </p>
            )}
          </div>
        </div>

        {/* Download button */}
        <DownloadSessionReportButton session={session} />
      </div>
    </div>
  );
};

export default DownloadSessionReportContainer;
