// src/components/notifications/ManualPendingCard.jsx
import React from "react";
import { HandIcon } from "lucide-react";

const ManualPendingCard = ({ entry }) => {
  return (
    <div className="px-4 py-3 hover:bg-yellow-50 transition-colors">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <HandIcon className="w-4 h-4 text-yellow-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 font-medium mb-0.5">
            Manual Marking Required
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {entry.message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Detected at{" "}
            {new Date(entry.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualPendingCard;
