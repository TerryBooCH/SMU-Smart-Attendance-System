import React from "react";
import { Users } from "lucide-react";

const EmptyState = ({ data }) => (
  <div className="p-6 space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {/* six zero stat cards if desired */}
    </div>

    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Attendance Records</h3>
        <p className="text-gray-600 text-lg mb-2">
          Student <span className="font-semibold">{data.name}</span> ({data.studentId})
        </p>
        <p className="text-gray-500">
          has no attendance sessions recorded for <span className="font-semibold">{data.className}</span> yet.
        </p>
        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            Attendance records will appear here once the student attends their first session.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default EmptyState;
