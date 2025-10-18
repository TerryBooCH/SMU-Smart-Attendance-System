import React from "react";
import { User, IdCardLanyard, Mail, Phone, GraduationCap } from "lucide-react";
import ViewStudentDetailsButton from "./ViewStudentDetailsButton";

const StudentCard = ({ student, roster, viewMode }) => {
  const isListView = viewMode === "list";

  if (isListView) {
    return (
      <tr className="hover:bg-slate-50 transition-colors duration-150">
        {/* Thumbnail */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 text-gray-500 flex items-center justify-center flex-shrink-0">
            {student.imageBase64 ? (
              <img
                src={student.imageBase64}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
        </td>

        {/* Name */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm font-semibold text-slate-800">
            {student.name}
          </span>
        </td>

        {/* Student ID */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-slate-600 font-medium">
            {student.studentId}
          </span>
        </td>

        {/* Email */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-slate-600">{student.email}</span>
        </td>

        {/* Phone */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-slate-600">
            {student.phone || "N/A"}
          </span>
        </td>

        {/* ✅ Class */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-slate-600">
            {student.studentClass || "—"}
          </span>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="min-h-[32px]">
            <ViewStudentDetailsButton student={student} roster={roster} />
          </div>
        </td>
      </tr>
    );
  }

  // ✅ GRID VIEW
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
      <div className="p-6">
        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200 text-gray-500 flex items-center justify-center shadow-lg">
            {student.imageBase64 ? (
              <img
                src={student.imageBase64}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-14 h-14" />
            )}
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-bold text-slate-800 text-xl mb-1">
            {student.name}
          </h2>
          <p className="text-sm text-slate-500 mb-4">{student.studentId}</p>
        </div>

        <div className="space-y-3">
          {/* Student ID */}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <IdCardLanyard className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate font-semibold">
                {student.studentId}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate font-semibold">
                {student.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate font-semibold">
                {student.phone || "N/A"}
              </p>
            </div>
          </div>

          {/* ✅ Class Name */}
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate font-semibold">
                {student.studentClass || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-slate-100 min-h-[40px]">
          <ViewStudentDetailsButton student={student} roster={roster} />
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
