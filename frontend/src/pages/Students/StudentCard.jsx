import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, User } from "lucide-react";
import { getInitials } from "../../utils/stringUtils";
import DeleteStudentButton from "../../components/DeleteStudentButton";
import UpdateStudentButton from "../../components/UpdateStudentButton";

const StudentCard = ({ student }) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50">
      {/* Thumbnail Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        {student.face?.imageBase64 ? (
          <img
            src={student.face.imageBase64}
            alt={`${student.name}'s face`}
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
            <User size={28} />
          </div>
        )}
      </td>

      {/* Profile Column */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {getInitials(student.name)}
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {student.name || "N/A"}
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.email || "N/A"}</div>
      </td>

      {/* Student ID */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.studentId || "N/A"}</div>
      </td>

      {/* Class */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.className || "N/A"}</div>
      </td>

      {/* Phone */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{student.phone || "N/A"}</div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/student/${student.studentId}`)}
            className="flex items-center cursor-pointer px-2 py-2 text-black"
            title="View"
          >
            <Eye size={16} />
          </button>
          <UpdateStudentButton student={student} />
          <DeleteStudentButton student={student} />
        </div>
      </td>
    </tr>
  );
};

export default StudentCard;
