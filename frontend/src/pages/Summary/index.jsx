import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import StudentDashboardHeader from "../StudentDashboard/StudentDashboardHeader";
import MainDashboardContainer from "../StudentDashboard/MainDashboardContainer";
import useAuth from "../../hooks/useAuth";
import useStudent from "../../hooks/useStudent";

const Summary = () => {
  const { user, isLoading } = useAuth();
  const { fetchStudentById, selectedStudent, loading: studentLoading } = useStudent();
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    if (!isLoading && user) {
      const id = user.studentId;
      setStudentId(id);
      if (id) fetchStudentById(id);
    }
  }, [user, isLoading]);

  if (isLoading || studentLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading summary...</p>
      </div>
    );
  }

  if (!studentId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No student information available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20">
          <Breadcrumb items={[{ label: "Summary" }]} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <StudentDashboardHeader student={selectedStudent} />
          <MainDashboardContainer studentId={studentId} />
        </div>
      </main>
    </div>
  );
};

export default Summary;
