import React, { useState } from "react";
import { useModal } from "../hooks/useModal";
import FileTypeDropdown from "./FileTypeDropdown";
import FieldSelector from "./FieldSelector";
import { exportService } from "../api/exportService";
import useToast from "../hooks/useToast";
import { Loader2, Download } from "lucide-react";

const DownloadSessionReportForm = ({ session }) => {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ All optional fields checked by default
  const [fields, setFields] = useState({
    rosterName: true,
    startTime: true,
    endTime: true,
    lateAfter: true,
    status: true, // always true, not shown
    method: true,
    confidence: true,
    timestamp: true,
    arrivalOffset: true,
    open: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    try {
      await exportService.downloadSessionReport(session.id, selected.value, fields);
      success(`Session report downloaded successfully (${selected.value.toUpperCase()})`);
      closeModal();
    } catch (err) {
      console.error("Error downloading session report:", err);
      error("Failed to download session report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      {/* File Type Dropdown */}
      <div>
        <label htmlFor="format" className="block mb-2 text-sm font-medium text-gray-900">
          Select report format
        </label>
        <FileTypeDropdown selected={selected} onSelect={setSelected} />
      </div>

      {/* Field Selector */}
      <FieldSelector fields={fields} setFields={setFields} title="Session Fields to Include" />

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
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
          disabled={!selected || loading} // ✅ disabled until file type chosen
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm text-white font-medium transition-all
            ${
              !selected || loading
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
  );
};

export default DownloadSessionReportForm;
