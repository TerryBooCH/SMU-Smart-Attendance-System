import React from "react";
import { CreditCard, Mail, Phone, GraduationCap, User } from "lucide-react";
import { getInitials } from '../../utils/stringUtils';

const StudentDashboardHeader = ({ student }) => {
  const initials = getInitials(student?.name?.charAt(0) || "S");
  return (
    <div className="bg-white overflow-hidden">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Student Info */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                {student?.face?.imageBase64 ? (
                  <img
                    src={student.face.imageBase64}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-white">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                {student?.name || "Student Name"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5 font-medium whitespace-nowrap">
                Student Profile
              </p>
            </div>
          </div>

          {/* Right: Info Cards */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Student ID Card */}
            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0">
                <CreditCard
                  size={18}
                  className="text-amber-600"
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">
                  Student ID
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  {student?.studentId || "N/A"}
                </span>
              </div>
            </div>

            {/* Class Card */}
            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                <GraduationCap
                  size={18}
                  className="text-purple-600"
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">Class</span>
                <span className="text-xs text-gray-600 font-medium">
                  {student?.className || "N/A"}
                </span>
              </div>
            </div>

            {/* Email Card */}
            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-blue-600" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">Email</span>
                <span className="text-xs text-gray-600 font-medium max-w-[180px] truncate">
                  {student?.email || "N/A"}
                </span>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group relative flex items-center gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-green-600" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">Phone</span>
                <span className="text-xs text-gray-600 font-medium">
                  {student?.phone || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardHeader;
