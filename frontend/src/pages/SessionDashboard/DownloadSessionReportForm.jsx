import React, { useState } from "react";
import { FileDown, Loader2, CalendarClock } from "lucide-react";
import FileTypeDropdown from "../../components/FileTypeDropdown";
import { exportService } from "../../api/exportService";
import useToast from "../../hooks/useToast";

const DownloadSessionReportForm = ({ session }) => {
  const { success, error } = useToast();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !session?.id) return;

    setLoading(true);
    try {
      console.log(
        "Downloading session report for:",
        session?.title || session?.courseName || "Session",
        "as",
        selected.value
      );

      await exportService.downloadSessionReport(session.id, selected.value);

      success(`Session report downloaded successfully (${selected.value.toUpperCase()})`);
    } catch (err) {
      console.error("Error downloading session report:", err);
      error("Failed to download session report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white w-full border-t border-gray-200">
      <form className="w-full" onSubmit={handleSubmit}>
        {/* Header: session info + dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          {/* Session Info */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-2xl">
              <CalendarClock size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Download report for {session?.courseName || "Session"}
              </h3>
              {session?.title && (
                <p className="text-sm text-gray-500">{session.title}</p>
              )}
            </div>
          </div>

          {/* File format dropdown */}
          <div className="w-full md:w-56">
            <FileTypeDropdown selected={selected} onSelect={setSelected} />
          </div>
        </div>

        {/* Footer: download button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="submit"
            disabled={!selected || loading}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm text-white font-medium transition-all
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
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

export default DownloadSessionReportForm;
