import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import FileTypeDropdown from "../../components/FileTypeDropdown";
import { exportService } from "../../api/exportService";
import useToast from "../../hooks/useToast";
import { Loader2, Download } from "lucide-react";

const DownloadStudentReportForm = ({ student }) => {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected || !student?.studentId) return;

    setLoading(true);
    try {
      console.log(
        "Downloading student report for:",
        student.name,
        "as",
        selected.value
      );

      await exportService.downloadStudentReport(student.studentId, selected.value);

      success(`Student report downloaded successfully (${selected.value.toUpperCase()})`);
      closeModal();
    } catch (err) {
      console.error("Error downloading student report:", err);
      error("Failed to download student report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="w-full" onSubmit={handleSubmit}>
        {/* Label + Dropdown */}
        <div className="mb-5">
          <label
            htmlFor="format"
            className="block mb-2 text-sm text-gray-900 font-medium"
          >
            Select report format
          </label>
          <FileTypeDropdown selected={selected} onSelect={setSelected} />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeModal}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selected || loading}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium transition-all
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DownloadStudentReportForm;
