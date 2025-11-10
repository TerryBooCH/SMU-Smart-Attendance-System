import React from "react";
import { AlertTriangle, AlertCircle } from "lucide-react";
import useAttendance from "../../hooks/useAttendance";

const NotificationContent = () => {
  const { warnings, wsError, error } = useAttendance();

  if ((!warnings || warnings.length === 0) && !wsError && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">All clear!</p>
        <p className="text-gray-400 text-xs mt-1">No notifications at the moment</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {error && (
        <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium mb-0.5">
                Error
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {error}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Just now
              </p>
            </div>
          </div>
        </div>
      )}

      {wsError && (
        <div className="px-4 py-3 hover:bg-gray-50 transition-colors">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium mb-0.5">
                Connection Error
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {wsError}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Just now
              </p>
            </div>
          </div>
        </div>
      )}
      
      {warnings.map((warning, index) => (
        <div
          key={index}
          className="px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium mb-0.5">
                Missing Reference Photo
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {warning}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Just now
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContent;