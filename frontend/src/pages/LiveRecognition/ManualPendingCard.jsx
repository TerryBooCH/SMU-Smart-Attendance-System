import React, { useState } from "react";
import { HandIcon, XCircle, CheckCircle } from "lucide-react";
import useAttendance from "../../hooks/useAttendance";
import useToast from "../../hooks/useToast";

const ManualPendingCard = ({ entry, sessionId }) => {
  const { removeManualPendingByStudentId, updateAttendanceStatus } = useAttendance();
  const { success, error } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCancel = () => {
    removeManualPendingByStudentId(entry.studentId);
    success(`Removed ${entry.name || "student"} from manual list`);
  };

  const handleMarkPresent = async () => {
    try {
      setIsUpdating(true);
      await updateAttendanceStatus(sessionId, entry.studentId, "PRESENT", "MANUAL");
      removeManualPendingByStudentId(entry.studentId);
      success(`Marked ${entry.name || "student"} as Present`);
    } catch (err) {
      console.error("Error marking attendance:", err);
      error(err.message || "Failed to update attendance");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="px-4 py-3 hover:bg-yellow-50 transition-colors border-b border-yellow-100">
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <HandIcon className="w-4 h-4 text-yellow-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 font-medium mb-0.5">
            Manual Marking Required
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{entry.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            Detected at{" "}
            {new Date(entry.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Buttons */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-md px-3 py-1.5 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>

            <button
              onClick={handleMarkPresent}
              disabled={isUpdating}
              className={`inline-flex items-center gap-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md px-3 py-1.5 transition-colors ${
                isUpdating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {isUpdating ? "Updating..." : "Mark Present"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualPendingCard;
