import React from "react";
import DownloadStudentReportButton from "../../components/DownloadStudentReportButton";

const DownloadAttendanceReportContainer = ({ student }) => {
  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-900 font-lexend">
            Attendance Report
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-start gap-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Click below to download the student’s attendance report for your
            records and analysis.
          </p>

          {/* ✅ Uses your existing download button */}
          <DownloadStudentReportButton student={student} />
        </div>
      </div>
    </div>
  );
};

export default DownloadAttendanceReportContainer;
