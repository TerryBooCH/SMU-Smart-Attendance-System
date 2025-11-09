import React from "react";
import { FileDown } from "lucide-react";
import { useModal } from "../hooks/useModal";
import DownloadSessionReportForm from "./DownloadSessionReportForm";

const DownloadSessionReportButton = ({ session }) => {
  const { openModal } = useModal();

  const handleDownloadReport = () => {
    openModal(
      <DownloadSessionReportForm session={session} />,
      `Download Session Report for ${session.courseName}`
    );
  };

  return (
    <button
      onClick={handleDownloadReport}
      title="Download Session Report"
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 cursor-pointer
                 text-gray-800 hover:bg-gray-50 hover:border-indigo-400 hover:text-indigo-600
                 text-sm font-medium rounded-lg  transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
    >
      <FileDown size={16} />
      <span>Download Report</span>
    </button>
  );
};

export default DownloadSessionReportButton;
