import React, { useState } from "react";
import { logService } from "../../api/logService";
import useToast from "../../hooks/useToast";
import { Download, Loader2 } from "lucide-react"; // Loader2 for spinner

const DownloadLogFileButton = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await logService.downloadLogs();
      success("Log file downloaded successfully!");
    } catch (err) {
      console.error("Error downloading log file:", err);
      error("Failed to download log file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-white text-medium transition-colors ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download Log File
        </>
      )}
    </button>
  );
};

export default DownloadLogFileButton;
