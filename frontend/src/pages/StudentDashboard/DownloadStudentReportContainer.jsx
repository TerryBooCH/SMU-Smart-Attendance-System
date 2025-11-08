import React from "react";
import { User } from "lucide-react";
import DownloadStudentReportButton from "../../components/DownloadStudentReportButton";

const DownloadStudentReportContainer = ({ student }) => {
  return (
    <div className="p-6 bg-white w-full border-t border-gray-200">
      {/* Header: student info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Student Info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-2xl">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800 font-lexend">
              Download report for {student?.name || "Student"}
            </h3>
            <p className="text-sm text-gray-600 font-lexend">
              ID:{" "}
              <span className="font-medium">
                {student?.studentId || "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* Download button */}
        <DownloadStudentReportButton student={student} />
      </div>
    </div>
  );
};

export default DownloadStudentReportContainer;
