import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const NavigateToStudentDashboardButton = ({ student }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/student/${student.studentId}/dashboard`, {
      state: {
        from: "report",
        studentId: student.studentId,
      },
    });
  };

  return (
    <button
      onClick={handleClick}
      title="Go to Dashboard"
      className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 
                 text-white text-sm font-medium rounded-lg shadow-sm transition-all 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
    >
      <LayoutDashboard size={16} />
      <span>Dashboard</span>
    </button>
  );
};

export default NavigateToStudentDashboardButton;
