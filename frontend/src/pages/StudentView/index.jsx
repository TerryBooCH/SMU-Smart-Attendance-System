import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
import PageHeader from "../../components/PageHeader";
import UserBanner from './UserBanner';
import { useStudents } from '../../context/StudentContext';
import UpdateStudentDetailsForm from './UpdateStudentDetailsForm';

const StudentView = () => {
  const { id } = useParams();
  
  const { selectedStudent, loading, error, fetchStudentById } = useStudents();

  useEffect(() => {
    if (id) {
      fetchStudentById(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="h-screen w-full bg-[#fafafa]">
          <PageHeader title="Students" subtitle="Manage student records." />
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading student data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="h-screen w-full bg-[#fafafa]">
          <PageHeader title="Students" subtitle="Manage student records." />
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="h-screen w-full bg-[#fafafa]">
          <PageHeader title="Students" subtitle="Manage student records." />
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Student not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="h-screen w-full bg-[#fafafa]">
        <PageHeader title="Students" subtitle="Manage student records." />
        <UserBanner 
          student={selectedStudent}
        />
        <UpdateStudentDetailsForm 
          student={selectedStudent}
        />
      </main>
    </div>
  );
};

export default StudentView;