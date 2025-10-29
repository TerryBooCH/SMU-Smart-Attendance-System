import React, { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Grid3x3,
  List,
} from "lucide-react";
import AttendanceCard from "./AttendanceCard";

const AttendanceContainer = ({ attendances }) => {
  const [viewMode, setViewMode] = useState("grid");

  if (!attendances?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Attendance Records
        </h1>

        <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
              viewMode === "grid"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="text-sm">Grid</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
              viewMode === "table"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List className="w-4 h-4" />
            <span className="text-sm">Table</span>
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {attendances.map((record) => (
            <AttendanceCard
              key={record.id}
              record={record}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Status
                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Method
                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Confidence
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Student ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendances.map((record) => (
                  <AttendanceCard
                    key={record.id}
                    record={record}
                    viewMode={viewMode}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceContainer;
