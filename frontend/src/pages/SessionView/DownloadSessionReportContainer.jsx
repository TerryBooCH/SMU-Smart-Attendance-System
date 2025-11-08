import React from "react";
import DownloadSessionReportButton from "../../components/DownloadSessionReportButton";

const DownloadSessionReportContainer = ({ session }) => {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl px-6 py-6 transition-all hover:shadow-md">
        {/* Left: Description */}
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-gray-800 font-lexend">
            Download Session Report
          </h2>
          <p className="text-sm text-gray-600 mt-1 font-lexend">
            Click below to download this session’s summary and insights for your records.
          </p>
        </div>

        {/* Right: Download button */}
        <DownloadSessionReportButton session={session} />
      </div>
    </div>
  );
};

export default DownloadSessionReportContainer;
