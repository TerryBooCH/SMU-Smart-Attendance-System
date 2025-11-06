import React, { useState } from "react";
import { logService } from "../../api/logService";
import useToast from "../../hooks/useToast";
import { Download, Loader2 } from "lucide-react";

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
      className={`flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all
        ${loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-black hover:bg-gray-800"}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-5 h-5" />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          <span>Download Log File</span>
        </>
      )}
    </button>
  );
};

export default DownloadLogFileButton;
