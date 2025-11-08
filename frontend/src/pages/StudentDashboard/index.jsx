import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import useStudent from "../../hooks/useStudent";
import StudentDashboardHeader from "./StudentDashboardHeader";
import MainDashboardContainer from "./MainDashboardContainer";
import DownloadStudentReportForm from "./DownloadStudentReportForm";

const StudentDashboard = () => {
  const { id } = useParams();
  const location = useLocation();
  const { selectedStudent, loading, error, fetchStudentById } = useStudent();

  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
  }, [id]);

  const from = location.state?.from;

  const breadcrumbItems =
    from === "report"
      ? [
          { label: "Home", href: "/home" },
          { label: "Reports", href: "/reports" },
          { label: "Students", href: "/students" },
          {
            label: selectedStudent?.name || "View Student",
            href: `/student/${id}`,
          },
          { label: "Student Dashboard" },
        ]
      : [
          { label: "Home", href: "/home" },
          { label: "Students", href: "/students" },
          {
            label: selectedStudent?.name || "View Student",
            href: `/student/${id}`,
          },
          { label: "Student Dashboard" },
        ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <StudentDashboardHeader student={selectedStudent} />
          <DownloadStudentReportForm student={selectedStudent} />
          <MainDashboardContainer studentId={id} />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
