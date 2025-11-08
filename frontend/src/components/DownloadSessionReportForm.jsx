import React, { useState } from "react";
import { useModal } from "../hooks/useModal";
import FileTypeDropdown from "./FileTypeDropdown";
import { exportService } from "../api/exportService";
import useToast from "../hooks/useToast";
import { Loader2, Download } from "lucide-react";

const DownloadSessionReportForm = ({ session }) => {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;

    setLoading(true);
    try {
      console.log("Downloading session report as:", selected.value);

      await exportService.downloadSessionReport(session.id, selected.value);

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
    <div>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="format"
            className="block mb-2 text-sm text-gray-900 font-medium"
          >
            Select report format
          </label>
          <FileTypeDropdown selected={selected} onSelect={setSelected} />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
            onClick={closeModal}
            disabled={loading}
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

export default DownloadSessionReportForm;
