import React from "react";
import Tooltip from "../../components/ToolTip";
import DownloadLogFileButton from "./DownloadLogFileButton";
import { Info } from "lucide-react";

const LogEventsSettingsContainer = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-800">Log Events</h2>
        </div>

        {/* Content */}
        <div className="p-6 flex items-center justify-between gap-6">
          {/* Left side: description */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-600">
                Download Logs
              </label>
              <div className="cursor-pointer">
                <Tooltip
                  content="Download a file containing recent log events for system diagnostics."
                  position="right"
                >
                  <Info size={16} />
                </Tooltip>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              You can download a log file that contains detailed records of system
              events, errors, and activity. This can be useful for debugging or
              support purposes.
            </p>
          </div>

          {/* Right side: placeholder for button */}
          <div className=" flex justify-end">
            <div >
              <DownloadLogFileButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogEventsSettingsContainer;
