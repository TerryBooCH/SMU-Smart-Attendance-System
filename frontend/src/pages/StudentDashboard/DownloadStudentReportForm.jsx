import React, { useState } from "react";
import { FileDown, Loader2, User } from "lucide-react";
import FileTypeDropdown from "../../components/FileTypeDropdown";
import { exportService } from "../../api/exportService";
import useToast from "../../hooks/useToast";

const DownloadStudentReportForm = ({ student }) => {
  const { success, error } = useToast();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !student?.studentId) return;

    setLoading(true);
    try {
      console.log("Downloading report for:", student.name, "as", selected.value);

      await exportService.downloadStudentReport(student.studentId, selected.value);

      success(`Student report downloaded successfully (${selected.value.toUpperCase()})`);
    } catch (err) {
      console.error("Error downloading student report:", err);
      error("Failed to download student report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white w-full border-t border-gray-200">
      <form className="w-full" onSubmit={handleSubmit}>
        {/* Header: student info + dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          {/* Student Info */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-2xl">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Download report for {student?.name || "Student"}
              </h3>
              <p className="text-sm text-gray-600">
                ID:{" "}
                <span className="font-medium">
                  {student?.studentId || "N/A"}
                </span>
              </p>
            </div>
          </div>

          {/* File format dropdown */}
          <div className="w-full md:w-56">
            <FileTypeDropdown selected={selected} onSelect={setSelected} />
          </div>
        </div>

        {/* Footer: Download button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="submit"
            disabled={!selected || loading}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm text-white font-medium transition-all
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <FileDown size={16} />
                <span>Download Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DownloadStudentReportForm;
