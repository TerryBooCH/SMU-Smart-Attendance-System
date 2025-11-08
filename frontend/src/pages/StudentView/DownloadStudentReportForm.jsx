import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import FileTypeDropdown from "../../components/FileTypeDropdown";
import { exportService } from "../../api/exportService";
import useToast from "../../hooks/useToast";

const DownloadAttendanceReportForm = ({ student }) => {
  const { success, error } = useToast();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !student?.studentId) return;

    setLoading(true);
    try {
      console.log(
        "Downloading attendance report for:",
        student.name,
        "as",
        selected.value
      );

      // ✅ Call your existing export service
      await exportService.downloadStudentReport(student.studentId, selected.value);

      success(`Attendance report downloaded successfully (${selected.value.toUpperCase()})`);
    } catch (err) {
      console.error("Error downloading attendance report:", err);
      error("Failed to download attendance report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece]">
          <h2 className="font-semibold text-lg text-gray-900 font-lexend">
            Attendance Report
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 space-y-6 font-lexend"
        >
          {/* Description + Dropdown */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm text-gray-600 leading-relaxed">
                Select a file format from the dropdown and download the
                attendance report for this student. Use it for your internal
                tracking or record keeping.
              </p>
            </div>

            <div className="w-full md:w-56">
              <FileTypeDropdown
                selected={selected}
                onSelect={(option) => setSelected(option)}
              />
            </div>
          </div>

          {/* Button */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={!selected || loading}
              className={`text-white text-sm font-lexend px-4 py-2 rounded-xl flex items-center gap-2 transition-all
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 cursor-pointer"
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
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DownloadAttendanceReportForm;
