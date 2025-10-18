import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

const ViewStudentDetailsButton = ({ student, roster }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/student/${student.studentId}`, {
      state: { 
        from: 'rosters',
        rosterId: roster?.id,
        rosterName: roster?.name 
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      title="View"
      className="flex items-center justify-center p-2 text-gray-600 rounded-md 
                 hover:bg-gray-100 hover:text-gray-900 
                 transition-colors duration-200 cursor-pointer"
    >
      <Eye size={16} />
    </button>
  );
};

export default ViewStudentDetailsButton;