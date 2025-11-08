import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
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
      console.log("Downloading session report for:", session.id, "as", selected.value);

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
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl px-6 py-6 transition-all hover:shadow-md">
        {/* Left: Description */}
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-gray-800 font-lexend">
            Download Session Report
          </h2>
          <p className="text-sm text-gray-600 mt-1 font-lexend">
            Choose your preferred file format to download this session’s summary and insights.
          </p>
        </div>

        {/* Right: Dropdown + Button */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-3 font-lexend"
        >
          <div className="w-40 md:w-48">
            <FileTypeDropdown
              selected={selected}
              onSelect={(option) => setSelected(option)}
            />
          </div>

          <button
            type="submit"
            disabled={!selected || loading}
            className={`text-white text-sm font-lexend px-4 py-2 rounded-lg flex items-center gap-2 transition-all
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
        </form>
      </div>
    </div>
  );
};

export default DownloadSessionReportForm;
